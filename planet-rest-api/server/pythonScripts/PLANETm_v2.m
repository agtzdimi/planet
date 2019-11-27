%Initialization of control
messageJSON=jsondecode(fileread('Control_initialization.txt'));
control= messageJSON.payload.control;
RES_curtailment_on_off=messageJSON.payload.RES_curtailment;

%Initialization of simulation parameters
messageJSON=jsondecode(fileread('Parameters_initialization.txt'));
dt=messageJSON.payload.simulation.time_step;
span=messageJSON.payload.simulation.simulation_time; %how many dt

%Initialization of technologies for the nodes
% NODE 1
Pn_PV_v(1)         =messageJSON.payload.technologies.node_1.PV.nominal_electric_power;
Pn_Wind_v(1)       =messageJSON.payload.technologies.node_1.WT.nominal_electric_power;  
CHP_Pn_v(1)        =messageJSON.payload.technologies.node_1.CHP.nominal_electric_power;
CHP_eta_el_v(1)    =messageJSON.payload.technologies.node_1.CHP.efficiency_electric;
CHP_eta_th_v(1)    =messageJSON.payload.technologies.node_1.CHP.efficiency_thermal;
DH_HP_Cap_v(1)     =messageJSON.payload.technologies.node_1.P2H.DH.HP.nominal_heat_power;
DH_HP_COP_v(1)     =messageJSON.payload.technologies.node_1.P2H.DH.HP.cop;
DH_elB_Cap_v(1)    =messageJSON.payload.technologies.node_1.P2H.DH.EH.nominal_heat_power;
DH_elB_eff_v(1)    =messageJSON.payload.technologies.node_1.P2H.DH.EH.efficiency_thermal;
LHD_HP_Cap_v(1)    =messageJSON.payload.technologies.node_1.P2H.LHD.HP.nominal_heat_power;
LHD_HP_COP_v(1)    =messageJSON.payload.technologies.node_1.P2H.LHD.HP.cop;
LHD_elB_Cap_v(1)   =messageJSON.payload.technologies.node_1.P2H.LHD.EH.nominal_heat_power;
LHD_elB_eff_v(1)   =messageJSON.payload.technologies.node_1.P2H.LHD.EH.efficiency_thermal;
PtG_cap_v(1)       =messageJSON.payload.technologies.node_1.P2G.nominal_electric_power;
PtG_eta_elcto_v(1) =messageJSON.payload.technologies.node_1.P2G.efficiency_electrolysis;
PtG_eta_meth_v(1)  =messageJSON.payload.technologies.node_1.P2G.efficiency_methanation;
PtG_eta_th_v(1)    =messageJSON.payload.technologies.node_1.P2G.efficiency_thermal;
Liion_cap_v(1)     =messageJSON.payload.technologies.node_1.EB.storage_electric_capacity;
Liion_eff_ch_v(1)  =messageJSON.payload.technologies.node_1.EB.efficiency_charge;
Liion_eff_dis_v(1) =messageJSON.payload.technologies.node_1.EB.efficiency_discharge;
C_rate_Liion_v(1)  =messageJSON.payload.technologies.node_1.EB.c_rate;
Liion_charge_v(1)  =Liion_cap_v(1)*C_rate_Liion_v(1);
Liion_dis_v(1)     =Liion_cap_v(1)*C_rate_Liion_v(1);
DH_gas_B_Cap_v(1)  =messageJSON.payload.technologies.node_1.G2H.DH.nomial_heat_power;
DH_gas_B_eff_v(1)  =messageJSON.payload.technologies.node_1.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(1) =messageJSON.payload.technologies.node_1.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(1) =messageJSON.payload.technologies.node_1.G2H.LHD.efficiency_thermal;


%NODE2
        Pn_PV_v(2)=messageJSON.payload.technologies.node_2.PV.nominal_electric_power;
      Pn_Wind_v(2)=messageJSON.payload.technologies.node_2.WT.nominal_electric_power;  
       CHP_Pn_v(2)=messageJSON.payload.technologies.node_2.CHP.nominal_electric_power;
   CHP_eta_el_v(2)=messageJSON.payload.technologies.node_2.CHP.efficiency_electric;
   CHP_eta_th_v(2)=messageJSON.payload.technologies.node_2.CHP.efficiency_thermal;
    DH_HP_Cap_v(2)=messageJSON.payload.technologies.node_2.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(2)=messageJSON.payload.technologies.node_2.P2H.DH.HP.cop;
   DH_elB_Cap_v(2)=messageJSON.payload.technologies.node_2.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(2)=messageJSON.payload.technologies.node_2.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(2)=messageJSON.payload.technologies.node_2.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(2)=messageJSON.payload.technologies.node_2.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(2)=messageJSON.payload.technologies.node_2.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(2)=messageJSON.payload.technologies.node_2.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(2)=messageJSON.payload.technologies.node_2.P2G.nominal_electric_power;
PtG_eta_elcto_v(2)=messageJSON.payload.technologies.node_2.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(2)=messageJSON.payload.technologies.node_2.P2G.efficiency_methanation;
   PtG_eta_th_v(2)=messageJSON.payload.technologies.node_2.P2G.efficiency_thermal;
    Liion_cap_v(2)=messageJSON.payload.technologies.node_2.EB.storage_electric_capacity;
 Liion_eff_ch_v(2)=messageJSON.payload.technologies.node_2.EB.efficiency_charge;
Liion_eff_dis_v(2)=messageJSON.payload.technologies.node_2.EB.efficiency_discharge;
 C_rate_Liion_v(2)=messageJSON.payload.technologies.node_2.EB.c_rate;
 Liion_charge_v(2)=Liion_cap_v(2)*C_rate_Liion_v(2);
    Liion_dis_v(2)=Liion_cap_v(2)*C_rate_Liion_v(2);
 DH_gas_B_Cap_v(2)=messageJSON.payload.technologies.node_2.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(2)=messageJSON.payload.technologies.node_2.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(2)=messageJSON.payload.technologies.node_2.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(2)=messageJSON.payload.technologies.node_2.G2H.LHD.efficiency_thermal;

%NODE3
        Pn_PV_v(3)=messageJSON.payload.technologies.node_3.PV.nominal_electric_power;
      Pn_Wind_v(3)=messageJSON.payload.technologies.node_3.WT.nominal_electric_power;  
       CHP_Pn_v(3)=messageJSON.payload.technologies.node_3.CHP.nominal_electric_power;
   CHP_eta_el_v(3)=messageJSON.payload.technologies.node_3.CHP.efficiency_electric;
   CHP_eta_th_v(3)=messageJSON.payload.technologies.node_3.CHP.efficiency_thermal;
    DH_HP_Cap_v(3)=messageJSON.payload.technologies.node_3.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(3)=messageJSON.payload.technologies.node_3.P2H.DH.HP.cop;
   DH_elB_Cap_v(3)=messageJSON.payload.technologies.node_3.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(3)=messageJSON.payload.technologies.node_3.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(3)=messageJSON.payload.technologies.node_3.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(3)=messageJSON.payload.technologies.node_3.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(3)=messageJSON.payload.technologies.node_3.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(3)=messageJSON.payload.technologies.node_3.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(3)=messageJSON.payload.technologies.node_3.P2G.nominal_electric_power;
PtG_eta_elcto_v(3)=messageJSON.payload.technologies.node_3.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(3)=messageJSON.payload.technologies.node_3.P2G.efficiency_methanation;
   PtG_eta_th_v(3)=messageJSON.payload.technologies.node_3.P2G.efficiency_thermal;
    Liion_cap_v(3)=messageJSON.payload.technologies.node_3.EB.storage_electric_capacity;
 Liion_eff_ch_v(3)=messageJSON.payload.technologies.node_3.EB.efficiency_charge;
Liion_eff_dis_v(3)=messageJSON.payload.technologies.node_3.EB.efficiency_discharge;
 C_rate_Liion_v(3)=messageJSON.payload.technologies.node_3.EB.c_rate;
 Liion_charge_v(3)=Liion_cap_v(3)*C_rate_Liion_v(3);
    Liion_dis_v(3)=Liion_cap_v(3)*C_rate_Liion_v(3);
 DH_gas_B_Cap_v(3)=messageJSON.payload.technologies.node_3.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(3)=messageJSON.payload.technologies.node_3.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(3)=messageJSON.payload.technologies.lode_3.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(3)=messageJSON.payload.technologies.node_3.G2H.LHD.efficiency_thermal;

%NODE4
        Pn_PV_v(4)=messageJSON.payload.technologies.node_4.PV.nominal_electric_power;
      Pn_Wind_v(4)=messageJSON.payload.technologies.node_4.WT.nominal_electric_power;  
       CHP_Pn_v(4)=messageJSON.payload.technologies.node_4.CHP.nominal_electric_power;
   CHP_eta_el_v(4)=messageJSON.payload.technologies.node_4.CHP.efficiency_electric;
   CHP_eta_th_v(4)=messageJSON.payload.technologies.node_4.CHP.efficiency_thermal;
    DH_HP_Cap_v(4)=messageJSON.payload.technologies.node_4.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(4)=messageJSON.payload.technologies.node_4.P2H.DH.HP.cop;
   DH_elB_Cap_v(4)=messageJSON.payload.technologies.node_4.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(4)=messageJSON.payload.technologies.node_4.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(4)=messageJSON.payload.technologies.node_4.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(4)=messageJSON.payload.technologies.node_4.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(4)=messageJSON.payload.technologies.node_4.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(4)=messageJSON.payload.technologies.node_4.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(4)=messageJSON.payload.technologies.node_4.P2G.nominal_electric_power;
PtG_eta_elcto_v(4)=messageJSON.payload.technologies.node_4.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(4)=messageJSON.payload.technologies.node_4.P2G.efficiency_methanation;
   PtG_eta_th_v(4)=messageJSON.payload.technologies.node_4.P2G.efficiency_thermal;
    Liion_cap_v(4)=messageJSON.payload.technologies.node_4.EB.storage_electric_capacity;
 Liion_eff_ch_v(4)=messageJSON.payload.technologies.node_4.EB.efficiency_charge;
Liion_eff_dis_v(4)=messageJSON.payload.technologies.node_4.EB.efficiency_discharge;
 C_rate_Liion_v(4)=messageJSON.payload.technologies.node_4.EB.c_rate;
 Liion_charge_v(4)=Liion_cap_v(4)*C_rate_Liion_v(4);
    Liion_dis_v(4)=Liion_cap_v(4)*C_rate_Liion_v(4);
 DH_gas_B_Cap_v(4)=messageJSON.payload.technologies.node_4.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(4)=messageJSON.payload.technologies.node_4.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(4)=messageJSON.payload.technologies.node_4.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(4)=messageJSON.payload.technologies.node_4.G2H.LHD.efficiency_thermal;

%NODE5
        Pn_PV_v(5)=messageJSON.payload.technologies.node_5.PV.nominal_electric_power;
      Pn_Wind_v(5)=messageJSON.payload.technologies.node_5.WT.nominal_electric_power;  
       CHP_Pn_v(5)=messageJSON.payload.technologies.node_5.CHP.nominal_electric_power;
   CHP_eta_el_v(5)=messageJSON.payload.technologies.node_5.CHP.efficiency_electric;
   CHP_eta_th_v(5)=messageJSON.payload.technologies.node_5.CHP.efficiency_thermal;
    DH_HP_Cap_v(5)=messageJSON.payload.technologies.node_5.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(5)=messageJSON.payload.technologies.node_5.P2H.DH.HP.cop;
   DH_elB_Cap_v(5)=messageJSON.payload.technologies.node_5.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(5)=messageJSON.payload.technologies.node_5.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(5)=messageJSON.payload.technologies.node_5.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(5)=messageJSON.payload.technologies.node_5.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(5)=messageJSON.payload.technologies.node_5.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(5)=messageJSON.payload.technologies.node_5.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(5)=messageJSON.payload.technologies.node_5.P2G.nominal_electric_power;
PtG_eta_elcto_v(5)=messageJSON.payload.technologies.node_5.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(5)=messageJSON.payload.technologies.node_5.P2G.efficiency_methanation;
   PtG_eta_th_v(5)=messageJSON.payload.technologies.node_5.P2G.efficiency_thermal;
    Liion_cap_v(5)=messageJSON.payload.technologies.node_5.EB.storage_electric_capacity;
 Liion_eff_ch_v(5)=messageJSON.payload.technologies.node_5.EB.efficiency_charge;
Liion_eff_dis_v(5)=messageJSON.payload.technologies.node_5.EB.efficiency_discharge;
 C_rate_Liion_v(5)=messageJSON.payload.technologies.node_5.EB.c_rate;
 Liion_charge_v(5)=Liion_cap_v(5)*C_rate_Liion_v(5);
    Liion_dis_v(5)=Liion_cap_v(5)*C_rate_Liion_v(5);
 DH_gas_B_Cap_v(5)=messageJSON.payload.technologies.node_5.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(5)=messageJSON.payload.technologies.node_5.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(5)=messageJSON.payload.technologies.node_5.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(5)=messageJSON.payload.technologies.node_5.G2H.LHD.efficiency_thermal;

%NODE6
        Pn_PV_v(6)=messageJSON.payload.technologies.node_6.PV.nominal_electric_power;
      Pn_Wind_v(6)=messageJSON.payload.technologies.node_6.WT.nominal_electric_power;  
       CHP_Pn_v(6)=messageJSON.payload.technologies.node_6.CHP.nominal_electric_power;
   CHP_eta_el_v(6)=messageJSON.payload.technologies.node_6.CHP.efficiency_electric;
   CHP_eta_th_v(6)=messageJSON.payload.technologies.node_6.CHP.efficiency_thermal;
    DH_HP_Cap_v(6)=messageJSON.payload.technologies.node_6.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(6)=messageJSON.payload.technologies.node_6.P2H.DH.HP.cop;
   DH_elB_Cap_v(6)=messageJSON.payload.technologies.node_6.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(6)=messageJSON.payload.technologies.node_6.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(6)=messageJSON.payload.technologies.node_6.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(6)=messageJSON.payload.technologies.node_6.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(6)=messageJSON.payload.technologies.node_6.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(6)=messageJSON.payload.technologies.node_6.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(6)=messageJSON.payload.technologies.node_6.P2G.nominal_electric_power;
PtG_eta_elcto_v(6)=messageJSON.payload.technologies.node_6.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(6)=messageJSON.payload.technologies.node_6.P2G.efficiency_methanation;
   PtG_eta_th_v(6)=messageJSON.payload.technologies.node_6.P2G.efficiency_thermal;
    Liion_cap_v(6)=messageJSON.payload.technologies.node_6.EB.storage_electric_capacity;
 Liion_eff_ch_v(6)=messageJSON.payload.technologies.node_6.EB.efficiency_charge;
Liion_eff_dis_v(6)=messageJSON.payload.technologies.node_6.EB.efficiency_discharge;
 C_rate_Liion_v(6)=messageJSON.payload.technologies.node_6.EB.c_rate;
 Liion_charge_v(6)=Liion_cap_v(6)*C_rate_Liion_v(6);
    Liion_dis_v(6)=Liion_cap_v(6)*C_rate_Liion_v(6);
 DH_gas_B_Cap_v(6)=messageJSON.payload.technologies.node_6.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(6)=messageJSON.payload.technologies.node_6.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(6)=messageJSON.payload.technologies.node_6.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(6)=messageJSON.payload.technologies.node_6.G2H.LHD.efficiency_thermal;

%NODE7
        Pn_PV_v(7)=messageJSON.payload.technologies.node_7.PV.nominal_electric_power;
      Pn_Wind_v(7)=messageJSON.payload.technologies.node_7.WT.nominal_electric_power;  
       CHP_Pn_v(7)=messageJSON.payload.technologies.node_7.CHP.nominal_electric_power;
   CHP_eta_el_v(7)=messageJSON.payload.technologies.node_7.CHP.efficiency_electric;
   CHP_eta_th_v(7)=messageJSON.payload.technologies.node_7.CHP.efficiency_thermal;
    DH_HP_Cap_v(7)=messageJSON.payload.technologies.node_7.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(7)=messageJSON.payload.technologies.node_7.P2H.DH.HP.cop;
   DH_elB_Cap_v(7)=messageJSON.payload.technologies.node_7.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(7)=messageJSON.payload.technologies.node_7.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(7)=messageJSON.payload.technologies.node_7.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(7)=messageJSON.payload.technologies.node_7.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(7)=messageJSON.payload.technologies.node_7.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(7)=messageJSON.payload.technologies.node_7.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(7)=messageJSON.payload.technologies.node_7.P2G.nominal_electric_power;
PtG_eta_elcto_v(7)=messageJSON.payload.technologies.node_7.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(7)=messageJSON.payload.technologies.node_7.P2G.efficiency_methanation;
   PtG_eta_th_v(7)=messageJSON.payload.technologies.node_7.P2G.efficiency_thermal;
    Liion_cap_v(7)=messageJSON.payload.technologies.node_7.EB.storage_electric_capacity;
 Liion_eff_ch_v(7)=messageJSON.payload.technologies.node_7.EB.efficiency_charge;
Liion_eff_dis_v(7)=messageJSON.payload.technologies.node_7.EB.efficiency_discharge;
 C_rate_Liion_v(7)=messageJSON.payload.technologies.node_7.EB.c_rate;
 Liion_charge_v(7)=Liion_cap_v(7)*C_rate_Liion_v(7);
    Liion_dis_v(7)=Liion_cap_v(7)*C_rate_Liion_v(7);
 DH_gas_B_Cap_v(7)=messageJSON.payload.technologies.node_7.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(7)=messageJSON.payload.technologies.node_7.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(7)=messageJSON.payload.technologies.node_7.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(7)=messageJSON.payload.technologies.node_7.G2H.LHD.efficiency_thermal;


%NODE8
        Pn_PV_v(8)=messageJSON.payload.technologies.node_8.PV.nominal_electric_power;
      Pn_Wind_v(8)=messageJSON.payload.technologies.node_8.WT.nominal_electric_power;  
       CHP_Pn_v(8)=messageJSON.payload.technologies.node_8.CHP.nominal_electric_power;
   CHP_eta_el_v(8)=messageJSON.payload.technologies.node_8.CHP.efficiency_electric;
   CHP_eta_th_v(8)=messageJSON.payload.technologies.node_8.CHP.efficiency_thermal;
    DH_HP_Cap_v(8)=messageJSON.payload.technologies.node_8.P2H.DH.HP.nominal_heat_power;
    DH_HP_COP_v(8)=messageJSON.payload.technologies.node_8.P2H.DH.HP.cop;
   DH_elB_Cap_v(8)=messageJSON.payload.technologies.node_8.P2H.DH.EH.nominal_heat_power;
   DH_elB_eff_v(8)=messageJSON.payload.technologies.node_8.P2H.DH.EH.efficiency_thermal;
   LHD_HP_Cap_v(8)=messageJSON.payload.technologies.node_8.P2H.LHD.HP.nominal_heat_power;
   LHD_HP_COP_v(8)=messageJSON.payload.technologies.node_8.P2H.LHD.HP.cop;
  LHD_elB_Cap_v(8)=messageJSON.payload.technologies.node_8.P2H.LHD.EH.nominal_heat_power;
  LHD_elB_eff_v(8)=messageJSON.payload.technologies.node_8.P2H.LHD.EH.efficiency_thermal;
      PtG_cap_v(8)=messageJSON.payload.technologies.node_8.P2G.nominal_electric_power;
PtG_eta_elcto_v(8)=messageJSON.payload.technologies.node_8.P2G.efficiency_electrolysis;
 PtG_eta_meth_v(8)=messageJSON.payload.technologies.node_8.P2G.efficiency_methanation;
   PtG_eta_th_v(8)=messageJSON.payload.technologies.node_8.P2G.efficiency_thermal;
    Liion_cap_v(8)=messageJSON.payload.technologies.node_8.EB.storage_electric_capacity;
 Liion_eff_ch_v(8)=messageJSON.payload.technologies.node_8.EB.efficiency_charge;
Liion_eff_dis_v(8)=messageJSON.payload.technologies.node_8.EB.efficiency_discharge;
 C_rate_Liion_v(8)=messageJSON.payload.technologies.node_8.EB.c_rate;
 Liion_charge_v(8)=Liion_cap_v(8)*C_rate_Liion_v(8);
    Liion_dis_v(8)=Liion_cap_v(8)*C_rate_Liion_v(8);
 DH_gas_B_Cap_v(8)=messageJSON.payload.technologies.node_8.G2H.DH.nomial_heat_power;
 DH_gas_B_eff_v(8)=messageJSON.payload.technologies.node_8.G2H.DH.efficiency_thermal;
LHD_gas_B_Cap_v(8)=messageJSON.payload.technologies.node_8.G2H.LHD.nomial_heat_power;
LHD_gas_B_eff_v(8)=messageJSON.payload.technologies.node_8.G2H.LHD.efficiency_thermal;
  
%Profiles initialisation
HEAT=xlsread('Heat.xlsx');
dh_demand=HEAT(:,1);
lhd_demand=HEAT(:,2);

ELECTRICITY=xlsread('Electricity.xlsx');
h_elD=ELECTRICITY(:,1)+ELECTRICITY(:,3)+ELECTRICITY(:,5)+ELECTRICITY(:,7)+ELECTRICITY(:,9)+ELECTRICITY(:,11)+ELECTRICITY(:,13)+ELECTRICITY(:,15); 

WIND_nominal=xlsread('Wind.xlsx');
WIND=WIND_nominal.*Pn_Wind_v;
WindPower=WIND(:,1)+WIND(:,2)+WIND(:,3)+WIND(:,4)+WIND(:,5)+WIND(:,6)+WIND(:,7)+WIND(:,8);
PROD_wind=sum(WindPower)*dt;

PV_nominal=xlsread('PV.xlsx');
PV=PV_nominal.*Pn_PV_v;
PVPower=PV(:,1)+PV(:,2)+PV(:,3)+PV(:,4)+PV(:,5)+PV(:,6)+PV(:,7)+PV(:,8);
PROD_PV=sum(PVPower)*dt;



Pn_PV=sum( Pn_PV_v );    
Pn_Wind=sum( Pn_Wind_v );       
CHP_Pn=sum( CHP_Pn_v );
CHP_eta_el=mean( CHP_eta_el_v );   
CHP_eta_th=mean( CHP_eta_th_v );   

DH_HP_Cap_th=sum( DH_HP_Cap_v );     
DH_HP_COP=mean( DH_HP_COP_v );     
DH_HP_Cap=DH_HP_Cap_th/DH_HP_COP;

DH_elB_Cap_th=sum( DH_elB_Cap_v );    
DH_elB_eff=mean( DH_elB_eff_v )/100;
DH_elB_Cap=DH_elB_Cap_th/DH_elB_eff;

LHD_HP_Cap_th=sum( LHD_HP_Cap_v );    
LHD_HP_COP=mean( LHD_HP_COP_v );   
LHD_HP_Cap=LHD_HP_Cap_th/LHD_HP_COP;

LHD_elB_Cap_th=sum( LHD_elB_Cap_v );   
LHD_elB_eff=mean( LHD_elB_eff_v )/100;   
LHD_elB_Cap=LHD_elB_Cap_th/LHD_elB_eff;

PtG_cap=sum( PtG_cap_v );       
PtG_eta_elcto=mean( PtG_eta_elcto_v ); 
PtG_eta_meth=mean( PtG_eta_meth_v );  
PtG_eta_th=mean( PtG_eta_th_v );    

Liion_cap=sum( Liion_cap_v );     
Liion_eff_ch=mean( Liion_eff_ch_v );  
Liion_eff_dis=mean( Liion_eff_dis_v );
C_rate_Liion=mean( C_rate_Liion_v );  
Liion_charge=sum( Liion_charge_v ); 
Liion_dis=sum( Liion_dis_v );

DH_gas_B_Cap=sum( DH_gas_B_Cap_v );  
DH_gas_B_eff=mean( DH_gas_B_eff_v );  

LHD_gas_B_Cap=sum( LHD_gas_B_Cap_v );
LHD_gas_B_eff=mean( LHD_gas_B_eff_v );  

PCI=1;

sim('PLANET_v2')

Time= time;
Electric_demand= El_demand;
WT_power=WindPower;
PV_power=PVPower;
RES_power=PVPower+WindPower;
Surplus= Surplus;
EB_input= Pump_Liion;
P2G_input= El_PtG;
P2H_input= El_PtH;
RES_Curtailment= RES_Curtailment;
RES_direct_utilization=PVPower+WindPower- Surplus;
EB_output =  Turb_Liion; 
CHP_el_production= CHP_electricity; 
DH_demand=  DH_demand;
LHD_demand = LHD_demand;
Total_heat_demand= DH_demand+ LHD_demand;
P2H_heat= h_P2H_elB_DH+ h_P2H_elB_LH+ h_P2H_HP_DH+ h_P2H_HP_LH;
CHP_heat=  chp_heat;
P2G_heat= PtG_heat;
G2H_heat= Gas_Boiler_DH_heat+ Gas_Boiler_LHD_heat;
Electric_grid_power_flow= -Electric_grid;

TAB1=table(Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,Electric_grid_power_flow);
writetable(TAB1, 'Results1.xlsx' )


%Post Processing

%Economic data initialisation   
messageJSON=jsondecode(fileread('Economy_environment_initialization.txt'));

NG_cost=messageJSON.payload.NG_cost;
SNG_cost=messageJSON.payload.SNG_cost;
heat_cost_sell=messageJSON.payload.heat_cost;
Carbon_tax=messageJSON.payload.carbon_tax;
Emission_factorNG=(messageJSON.payload.NG_emission_factor)*1000;

lifeT_Wind =messageJSON.payload.technologies_cost.WT.life_time;
lifeT_PV   =messageJSON.payload.technologies_cost.PV.life_time;
lifeT_CHP  =messageJSON.payload.technologies_cost.CHP.life_time;
lifeT_HP   =messageJSON.payload.technologies_cost.HP.life_time;
lifeT_elB  =messageJSON.payload.technologies_cost.EH.life_time;
lifeT_Liion=messageJSON.payload.technologies_cost.EB.life_time;
lifeT_PtG  =messageJSON.payload.technologies_cost.P2G.life_time;

Capex_Wind =1000* messageJSON.payload.technologies_cost.WT.CAPEX;
Capex_PV   =1000* messageJSON.payload.technologies_cost.PV.CAPEX;
Capex_CHP  =1000* messageJSON.payload.technologies_cost.CHP.CAPEX;
Capex_HP   =1000* messageJSON.payload.technologies_cost.HP.CAPEX;
Capex_elB  =1000* messageJSON.payload.technologies_cost.EH.CAPEX;
Capex_Liion=1000* messageJSON.payload.technologies_cost.EB.CAPEX;
Capex_PtG  =1000* messageJSON.payload.technologies_cost.P2G.CAPEX; 

Opex_Wind =Capex_Wind/100* messageJSON.payload.technologies_cost.WT.OPEX;
Opex_PV   =Capex_PV/100*   messageJSON.payload.technologies_cost.PV.OPEX;
Opex_CHP  =Capex_CHP/100*  messageJSON.payload.technologies_cost.CHP.OPEX;
Opex_HP   =Capex_HP/100*   messageJSON.payload.technologies_cost.HP.OPEX;
Opex_elB  =Capex_elB/100*  messageJSON.payload.technologies_cost.EH.OPEX;
Opex_Liion=Capex_Liion/100*messageJSON.payload.technologies_cost.EB.OPEX;
Opex_PtG  =Capex_PtG/100*  messageJSON.payload.technologies_cost.P2G.OPEX; 

RES2liion=sum( Pump_Liion)/1000*dt;
RES2PtG=sum( El_PtG)/1000*dt;
RES2PtH=sum( DH_HP_el+ LHD_HP_el+ DH_elB_el+ LHD_elB_el)/1000*dt;
Curtailment=sum( RES_Curtailment)/1000*dt;
El_dem=sum( El_demand)/1000*dt;
LiionProd=sum( Turb_Liion)/1000*dt;
CHPProd=sum( CHP_electricity)/1000*dt;
Th_dem=(sum( DH_demand)+sum(LHD_demand))/1000*dt;

P2HHeat=sum( DH_HP_heat+ LHD_HP_heat+ DH_elB_heat+ LHD_elB_heat)/1000*dt;
P2GHeat=sum( PtG_heat)/1000*dt;
CHPHeat=sum( chp_heat)/1000*dt;
G2HHeat=sum( Gas_Boiler_DH_heat+ Gas_Boiler_LHD_heat)/1000*dt;
NG_CHP=sum( chp_fuel)/1000*dt;
NG_P2G=sum( PtG_NG)/1000*dt;
PROD_RES=(PROD_wind+PROD_PV)/1000;

inv_Wind=((Capex_Wind*Pn_Wind)/lifeT_Wind)+Opex_Wind*Pn_Wind;
inv_PV=((Capex_PV*Pn_PV)/lifeT_PV)+Opex_PV*Pn_PV;
inv_CHP=((Capex_CHP*CHP_Pn)/lifeT_CHP)+Opex_CHP*CHP_Pn;
inv_Liion=((Capex_Liion*Liion_cap)/lifeT_Liion )+Opex_Liion*Liion_cap;
inv_PtG=((Capex_PtG*PtG_cap)/lifeT_PtG)+Opex_PtG*PtG_cap;
inv_HP=((Capex_HP*(DH_HP_Cap+LHD_HP_Cap ))/lifeT_HP)+Opex_HP*(DH_HP_Cap+LHD_HP_Cap);
inv_elB=((Capex_elB*(DH_elB_Cap+LHD_elB_Cap ))/lifeT_HP)+Opex_elB*(DH_elB_Cap+LHD_elB_Cap);

BOLIER_DH_NG=sum( Gas_Boiler_DH_fuel)/1000*dt;
BOLIER_LHD_NG=sum( Gas_Boiler_LHD_fuel)/1000*dt;
G2Hemission=(BOLIER_DH_NG+BOLIER_LHD_NG)*Emission_factorNG;
G2H_fuel=(BOLIER_DH_NG+BOLIER_LHD_NG);
CHPemission=NG_CHP*Emission_factorNG;
P2Gemission=-NG_P2G*Emission_factorNG;
CO2_emission= CHPemission+P2Gemission+G2Hemission;

inv_tot=inv_Wind+inv_PV+inv_CHP+inv_Liion+inv_PtG+inv_HP +inv_elB; 
Fuel_expediture=(NG_CHP*1000)*NG_cost;
SNG_revenue=-(NG_P2G*1000)*SNG_cost;
C_tax_expenditure=CO2_emission*Carbon_tax;
Heat_revenue=-((P2HHeat+P2GHeat+CHPHeat)*1000)*heat_cost_sell;

LCOE=(inv_tot+Fuel_expediture+C_tax_expenditure+SNG_revenue+Heat_revenue)/El_dem/(8760/(span*dt))/1000;

RES2dem=PROD_RES-RES2PtH- RES2liion- RES2PtG-  Curtailment;

GRAFICO1=[PROD_RES,RES2dem,RES2PtH,RES2liion,RES2PtG,Curtailment];
GRAFICO2=[ Th_dem,RES2dem,LiionProd,CHPProd];
GRAFICO3=[Th_dem,P2HHeat, CHPHeat, P2GHeat,G2HHeat];
GRAFICO4=[LCOE, inv_tot/10^6, Fuel_expediture/10^6,C_tax_expenditure/10^6, SNG_revenue/10^6, Heat_revenue/10^6];
GRAFICO5=[CO2_emission/1000, G2Hemission/1000, CHPemission/1000, P2Gemission/1000];
Grafico_tot=[GRAFICO1';GRAFICO2';GRAFICO3';GRAFICO4';GRAFICO5'];
Data_names={'RES producibility'; 'RES direct utilization';'RES to P2H';'RES to EB';'RES to P2G';'RES curtailment'; 'Electric demand';...
    'RES direct utilization'; 'EB to demand'; 'CHP el production'; 'Total heat demand'; 'P2H heat'; 'CHP heat'; 'P2G heat';...
    'G2H heat';'LCOE'; 'Total technologies annual cost'; 'NG expenditure'; 'CO2 emissions cost';'Revenue for SNG';...
    'Revenue for heat production';'Total CO2 emissions'; 'G2H CO2 emissions'; 'CHP CO2 emissions'; 'P2G CO2 savings'};

TAB2=table(Data_names,Grafico_tot);
writetable(TAB2, 'Results2.xlsx' )







