def run_optimization_pulp(df_input, target_df, param_df, return_json=False):

    print("INSIDE run_optimization_pulp")

    print("Sum of Purchase cost Before: ", df_input['Purchase Cost'].sum())

    # -----------------------------
    # ADD THIS BLOCK HERE
    # -----------------------------
    if target_df is None or target_df.empty:
        raise ValueError("Target data required for optimization")

    if param_df is None or param_df.empty:
        raise ValueError("Parameter data required for optimization")

    input_scrap_name = df_input['Scrap Type']
    input_scrap_cost = df_input['Purchase Cost']
    print("Sum of Purchase cost After: ", df_input['Purchase Cost'].sum())
    input_scrap_max = df_input['Max Quantity available (NT)']
    input_scrap_min = df_input['Min Quantity To be Use (NT)']

    input_kwh = df_input['KWH']
    input_yield = df_input['Yield']
    input_flux_index = df_input['Flux and Carbon Index']
    input_chem_table = df_input[['C','Si','Mn','Cu','Cr','Ni','Sn','P','S','Mb','Fe']]

    Input_total_cost = df_input['Total Yield + Power+ Flux Cost']

    # Fake constraint table for demonstration (replace with actual)
    target_df.index = target_df['Element']
    target_dict = target_df.to_dict(orient='index')

    n = len(input_scrap_name)

    # ---- Pulp Model ----
    m = LpProblem("Scrap_Optimization", LpMinimize)

    x = LpVariable.dicts("x", indices=range(n), lowBound=0, cat="Continuous")
    y = LpVariable.dicts("y", indices=range(n), lowBound=0, cat="Binary")

    # Objective function
    m += lpSum(Input_total_cost[i] * x[i] for i in range(n))

    # Constraints
    for i in range(n):
        m += x[i] <= input_scrap_max[i]
        m += x[i] >= input_scrap_min[i]

    total_qty = lpSum(x[i] for i in range(n))
    # m += total_qty >= 100000
    max_total_qty_per_heat = float(param_df.loc[param_df['Parameter']=='Total capacity per heat','Value'].values[0])
    m += total_qty >= max_total_qty_per_heat

    elements = input_chem_table.columns.tolist()
    for idx, element in enumerate(elements):
        input_chem_table[element] = input_chem_table[element].fillna(0)
        vec = input_chem_table[element].values

        # SKIP CONSTRAINT IF ALL ZERO
        if vec.sum() == 0:
            continue

        m += (lpSum(x[i] * vec[i] for i in range(n)) >= target_dict[element]['Min'] * total_qty)
        m += (lpSum(x[i] * vec[i] for i in range(n)) <= target_dict[element]['Max'] * total_qty)

    m.solve(get_cbc_solver(Path(__file__).parent))
    # m.solve(GUROBI())

    print("Solver Status:", m.status)

    # ---- Export to Excel in memory ----
    output = io.BytesIO()
    output_json = {}

    if m.status == 1:
        result_df = pd.DataFrame({
            "Scrap Type": input_scrap_name,
            "Quantity Used in Pound": [x[i].value() for i in range(n)],
            "Cost in Dollar per Pound": Input_total_cost,
            "Total Cost Contribution in Dollar": [x[i].value() * Input_total_cost[i] for i in range(n)]
        })

        chemistry = {}
        for element in elements:
            vec = input_chem_table[element].values
            avg = sum(x[i].value() * vec[i] for i in range(n)) / sum(x[i].value() for i in range(n))
            chemistry[element] = avg * 100

        chemistry_df = pd.DataFrame(chemistry, index=["Achieved Chemistry"])

        with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
            result_df.to_excel(writer, index=False, sheet_name="Scrap Mix")
            chemistry_df.to_excel(writer, sheet_name="Chemistry")

        output.seek(0)

        if return_json:
            output_json = {
                "scrap_mix": result_df.to_dict(orient="records"),
                "chemistry": chemistry_df.reset_index().to_dict(orient="records")
            }
    else:
        result_df = pd.DataFrame(['No Solution Found'], columns=['Result'])

        # ✅ ALWAYS CREATE CHEMISTRY SHEET
        chemistry_df = pd.DataFrame({'Message': ['No Chemistry Data']})

        with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
            result_df.to_excel(writer, index=False, sheet_name="Scrap Mix")
            chemistry_df.to_excel(writer, sheet_name="Chemistry")

        output.seek(0)

        output_json = {
            "scrap_mix": result_df.to_dict(orient="records")
        }

    # m.dispose()
    if return_json:
        return output, output_json
    return output