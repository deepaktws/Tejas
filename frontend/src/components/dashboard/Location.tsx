import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Navbar } from './Navbar';
import HomeTab from './HomeTab';
import AdminTab from './AdminTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

function Location() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex-1">
                <div className="flex flex-col h-full bg-surface-card">
                    <Box sx={{ borderBottom: 0, px: 2, py: 1 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Home" />
                            <Tab label="Admin" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <HomeTab/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <AdminTab/>
                    </CustomTabPanel>
                </div>
            </div>
        </div>
    )
}
export default Location
