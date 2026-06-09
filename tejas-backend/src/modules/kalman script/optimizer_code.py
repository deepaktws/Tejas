import pandas as pd
import numpy as np
# from gurobipy import Model, GRB, quicksum
import io
import os
from pulp import *
from pathlib import Path
import sys
from pulp import COIN_CMD
import json
from datetime import datetime
from io import BytesIO
import re
import matplotlib.pyplot as plt
from helper_functions import *

def run_optimization_pulp2(df_input, target_df, plan_weight):

    input_scrap_name = df_input['Scrap_Type']
    input_scrap_max = df_input['Inventory']
    # input_scrap_min = df_input['Min Quantity To be Use (NT)']

    # input_chem_table = df_input[['C','Si','Mn','Cu','Cr','Ni','Sn','P','S','Mb','Fe']]
    input_chem_table = df_input[['Fe', 'C', 'Cu', 'Ni', 'Cr', 'Mo', 'Sn', 'Si', 'Mn']] # from scrap availability file

    # Input_total_cost   = input_metalic_cost + input_power_cost + input_flux_cost
    Input_total_cost = df_input['Total Yield + Power+ Flux Cost']

    # Fake constraint table for demonstration (replace with actual) --> replaced
    target_df.index = target_df['Element']
    target_dict = target_df.to_dict(orient='index')
    # input_min_constraints = np.zeros(len(input_chem_table.columns))
    # input_max_constraints = np.ones(len(input_chem_table.columns)) * 1.0

    n = len(input_scrap_name)

    # ---- Pulp Model ----
    m = LpProblem("Scrap_Optimization", LpMinimize)

    x = LpVariable.dicts("x", indices=range(n), lowBound=0, cat="Continuous")
    y = LpVariable.dicts("y", indices=range(n), lowBound=0, cat="Binary")

    scrap_man_bin = LpVariable("bin_manual", lowBound=0, upBound=7, cat="Integer")
    scrap_rc_no = LpVariable("n_railcar", lowBound=0, upBound=7, cat="Integer")

    # Objective function
    m += lpSum(Input_total_cost[i] * x[i] for i in range(n))

    # Constraints
    for i in range(n):
        if input_scrap_max[i] == 0:
            m += x[i] == 0
            m += y[i] == 0
        else:
            m += x[i] <= input_scrap_max[i] * y[i]
            # m += x[i] >= input_scrap_min[i] * y[i]
            # m += x[i] >= 0.01 * y[i]

    total_qty = lpSum(x[i] for i in range(n))
    # max_total_qty_per_heat = float(param_df.loc[param_df['Parameter']=='Total capacity per heat','Value'].values[0])
    max_total_qty_per_heat = float(plan_weight)
    m += total_qty >= max_total_qty_per_heat

    # case 1
    # # if PI or HBI is selected then select 5 scraps else select <=7 scraps
    # manual_scrap = ['Pig Iron', 'HBI']
    # scrap_man = input_scrap_name[(input_scrap_name.isin(manual_scrap) == True)]
    # scrap_rc = input_scrap_name[(input_scrap_name.isin(manual_scrap) == False)]
    #
    # # Bin for manual scrap selection
    # for i in scrap_man.index:
    #     m += scrap_man_bin >= y[i]
    # m += scrap_man_bin <= lpSum(y[i] for i in scrap_man.index)
    #
    # # scrap no except pig iron and HBI
    # m += lpSum(y[i] for i in scrap_rc.index) == scrap_rc_no
    #
    # m += scrap_rc_no <= 5 + 2*(1-scrap_man_bin)
    # m += scrap_rc_no >= 5 * scrap_man_bin

    # case 2
    # m += lpSum(y[i] for i in range(n)) <= 7 # Only if pig iron and/or HBI is used
    # scrap_wo_pi_or_hbi = input_scrap_name[(input_scrap_name.isin(['Pig Iron','HBI'])==False)]
    # m += lpSum(y[i] for i in scrap_wo_pi_or_hbi.index) == 5

    # case 3 Maximum number of scraps are 7
    m += lpSum(y[i] for i in range(n)) <= 7

    elements = input_chem_table.columns.tolist()
    for idx, element in enumerate(elements):
        input_chem_table[element] = input_chem_table[element].fillna(0)
        vec = input_chem_table[element].values
        m += (lpSum(x[i] * vec[i] for i in range(n)) >= target_dict[element]['Min'] * total_qty)
        m += (lpSum(x[i] * vec[i] for i in range(n)) <= target_dict[element]['Max'] * total_qty)

    # Solve the model
    m.solve(PULP_CBC_CMD(msg=False))
    # m.solve(GUROBI())

    print("Solver Status:", m.status)

    # ---- Export to Excel in memory ----
    output = io.BytesIO()
    output_json = {}

    if m.status == 1:
        result_df = pd.DataFrame({
            "Scrap_Type": input_scrap_name,
            "Quantity Used in Tons": [round(x[i].value(),3) for i in range(n)],
            "Cost per Ton ($)": Input_total_cost,
            "Total Cost Contribution ($)": [x[i].value() * Input_total_cost[i] for i in range(n)]
        })

        chemistry = {}
        for element in elements:
            vec = input_chem_table[element].values
            avg = sum(x[i].value() * vec[i] for i in range(n)) / sum(x[i].value() for i in range(n))
            chemistry[element] = round(avg,3)

        chemistry_df = pd.DataFrame(chemistry, index=["Achieved Chemistry"])

       # with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        #    result_df.to_excel(writer, index=False, sheet_name="Scrap Mix")
         #   chemistry_df.to_excel(writer, sheet_name="Chemistry")

    else:
        result_df = pd.DataFrame({
            "Scrap_Type": ['No Solution Found'],
            "Quantity Used in Tons": [0],
            "Cost per Ton ($)": [0],
            "Total Cost Contribution ($)": [0]
        })
        
        chemistry_df = pd.DataFrame()

       # with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        #    result_df.to_excel(writer, index=False, sheet_name="Scrap Mix")
            # chemistry_df.to_excel(writer, sheet_name="Chemistry")

    return result_df, chemistry_df