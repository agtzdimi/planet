javaaddpath('C:\Users\Owner\Documents\paiko\JSON.jar')         %%% you need to change this directory 

PCI=1;

Control_initialization=fileread('Control_initialization.txt');
messageJSON = org.json.JSONObject(Control_initialization);

%Initialization of control
control= messageJSON.get('payload').get('control');

Parameters_initialization=fileread('Parameters_initialization.txt');
messageJSON = org.json.JSONObject(Parameters_initialization);

%Initialization of simulation parameters
dt=messageJSON.get('payload').get('simulation').get('time.step');
span=messageJSON.get('payload').get('simulation').get('simulation.time'); %how many dt


%Initialization of technologies for the nodes
% NODE 1

Pn_PV_v(1)         =messageJSON.get('payload').get('technologies').get('node.1').get('PV').get('nominal.electric.power');
Pn_Wind_v(1)       =messageJSON.get('payload').get('technologies').get('node.1').get('WT').get('nominal.electric.power');  
CHP_Pn_v(1)        =messageJSON.get('payload').get('technologies').get('node.1').get('CHP').get('nominal.electric.power');
CHP_eta_el_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('CHP').get('efficiency.electric');
CHP_eta_th_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('CHP').get('efficiency.thermal');
DH_HP_Cap_v(1)     =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('DH').get('HP').get('nominal.heat.power');
DH_HP_COP_v(1)     =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('DH').get('HP').get('cop');
DH_elB_Cap_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('DH').get('EH').get('nominal.heat.power');
DH_elB_eff_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('DH').get('EH').get('efficiency.thermal');
LHD_HP_Cap_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
LHD_HP_COP_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('LHD').get('HP').get('cop');
LHD_elB_Cap_v(1)   =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
LHD_elB_eff_v(1)   =messageJSON.get('payload').get('technologies').get('node.1').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
PtG_cap_v(1)       =messageJSON.get('payload').get('technologies').get('node.1').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(1) =messageJSON.get('payload').get('technologies').get('node.1').get('P2G').get('efficiency.electrolysis');
PtG_eta_meth_v(1)  =messageJSON.get('payload').get('technologies').get('node.1').get('P2G').get('efficiency.methanation');
PtG_eta_th_v(1)    =messageJSON.get('payload').get('technologies').get('node.1').get('P2G').get('efficiency.thermal');
Liion_cap_v(1)     =messageJSON.get('payload').get('technologies').get('node.1').get('EB').get('storage.electric.capacity');
Liion_eff_ch_v(1)  =messageJSON.get('payload').get('technologies').get('node.1').get('EB').get('efficiency.charge');
Liion_eff_dis_v(1) =messageJSON.get('payload').get('technologies').get('node.1').get('EB').get('efficiency.discharge');
C_rate_Liion_v(1)  =messageJSON.get('payload').get('technologies').get('node.1').get('EB').get('c.rate');
Liion_charge_v(1)  =Liion_cap_v(1)*C_rate_Liion_v(1);
Liion_dis_v(1)     =Liion_cap_v(1)*C_rate_Liion_v(1);
DH_gas_B_Cap_v(1)  =messageJSON.get('payload').get('technologies').get('node.1').get('G2H').get('DH').get('nomial.heat.power');
DH_gas_B_eff_v(1)  =messageJSON.get('payload').get('technologies').get('node.1').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(1) =messageJSON.get('payload').get('technologies').get('node.1').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(1) =messageJSON.get('payload').get('technologies').get('node.1').get('G2H').get('LHD').get('efficiency.thermal');


%NODE2

        Pn_PV_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('PV').get('nominal.electric.power');
      Pn_Wind_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('P2G').get('efficiency.thermal');
    Liion_cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('EB').get('efficiency.charge');
Liion_eff_dis_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('EB').get('c.rate');
 Liion_charge_v(2)=Liion_cap_v(2)*C_rate_Liion_v(2);
    Liion_dis_v(2)=Liion_cap_v(2)*C_rate_Liion_v(2);
 DH_gas_B_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(2)=messageJSON.get('payload').get('technologies').get('node.2').get('G2H').get('LHD').get('efficiency.thermal');



%NODE3

        Pn_PV_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('PV').get('nominal.electric.power');
      Pn_Wind_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.thermal');
    Liion_cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('efficiency.charge');
Liion_eff_dis_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('c.rate');
 Liion_charge_v(3)=Liion_cap_v(3)*C_rate_Liion_v(3);
    Liion_dis_v(3)=Liion_cap_v(3)*C_rate_Liion_v(3);
 DH_gas_B_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(3)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(3)=messageJSON.get('payload').get('technologies').get('node.2').get('G2H').get('LHD').get('efficiency.thermal');


%NODE4

        Pn_PV_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('PV').get('nominal.electric.power');
      Pn_Wind_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('P2G').get('efficiency.thermal');
    Liion_cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('efficiency.charge');
Liion_eff_dis_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('EB').get('c.rate');
 Liion_charge_v(4)=Liion_cap_v(4)*C_rate_Liion_v(4);
    Liion_dis_v(4)=Liion_cap_v(4)*C_rate_Liion_v(4);
 DH_gas_B_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(4)=messageJSON.get('payload').get('technologies').get('node.4').get('G2H').get('LHD').get('efficiency.thermal');


%NODE5

        Pn_PV_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('PV').get('nominal.electric.power');
      Pn_Wind_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('P2G').get('efficiency.thermal');
    Liion_cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('EB').get('efficiency.charge');
Liion_eff_dis_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('EB').get('c.rate');
 Liion_charge_v(5)=Liion_cap_v(5)*C_rate_Liion_v(5);
    Liion_dis_v(5)=Liion_cap_v(5)*C_rate_Liion_v(5);
 DH_gas_B_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(5)=messageJSON.get('payload').get('technologies').get('node.5').get('G2H').get('LHD').get('efficiency.thermal');


%NODE6

        Pn_PV_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('PV').get('nominal.electric.power');
      Pn_Wind_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('P2G').get('efficiency.thermal');
    Liion_cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('EB').get('efficiency.charge');
Liion_eff_dis_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('EB').get('c.rate');
 Liion_charge_v(6)=Liion_cap_v(6)*C_rate_Liion_v(6);
    Liion_dis_v(6)=Liion_cap_v(6)*C_rate_Liion_v(6);
 DH_gas_B_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(6)=messageJSON.get('payload').get('technologies').get('node.6').get('G2H').get('LHD').get('efficiency.thermal');


%NODE7

        Pn_PV_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('PV').get('nominal.electric.power');
      Pn_Wind_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('P2G').get('efficiency.thermal');
    Liion_cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('EB').get('efficiency.charge');
Liion_eff_dis_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('EB').get('c.rate');
 Liion_charge_v(7)=Liion_cap_v(7)*C_rate_Liion_v(7);
    Liion_dis_v(7)=Liion_cap_v(7)*C_rate_Liion_v(7);
 DH_gas_B_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(7)=messageJSON.get('payload').get('technologies').get('node.7').get('G2H').get('LHD').get('efficiency.thermal');


%NODE8

        Pn_PV_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('PV').get('nominal.electric.power');
      Pn_Wind_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('WT').get('nominal.electric.power');  
       CHP_Pn_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('CHP').get('nominal.electric.power');
   CHP_eta_el_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('CHP').get('efficiency.electric');
   CHP_eta_th_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('CHP').get('efficiency.thermal');
    DH_HP_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('DH').get('HP').get('nominal.heat.power');
    DH_HP_COP_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('DH').get('HP').get('cop');
   DH_elB_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('DH').get('EH').get('nominal.heat.power');
   DH_elB_eff_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('DH').get('EH').get('efficiency.thermal');
   LHD_HP_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('LHD').get('HP').get('nominal.heat.power');
   LHD_HP_COP_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('LHD').get('HP').get('cop');
  LHD_elB_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('LHD').get('EH').get('nominal.heat.power');
  LHD_elB_eff_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2H').get('LHD').get('EH').get('efficiency.thermal');
      PtG_cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2G').get('nominal.electric.power');
PtG_eta_elcto_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2G').get('efficiency.electrolysis');
 PtG_eta_meth_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2G').get('efficiency.methanation');
   PtG_eta_th_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('P2G').get('efficiency.thermal');
    Liion_cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('EB').get('storage.electric.capacity');
 Liion_eff_ch_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('EB').get('efficiency.charge');
Liion_eff_dis_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('EB').get('efficiency.discharge');
 C_rate_Liion_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('EB').get('c.rate');
 Liion_charge_v(8)=Liion_cap_v(8)*C_rate_Liion_v(8);
    Liion_dis_v(8)=Liion_cap_v(8)*C_rate_Liion_v(8);
 DH_gas_B_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('G2H').get('DH').get('nomial.heat.power');
 DH_gas_B_eff_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('G2H').get('DH').get('efficiency.thermal');
LHD_gas_B_Cap_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('G2H').get('LHD').get('nomial.heat.power');
LHD_gas_B_eff_v(8)=messageJSON.get('payload').get('technologies').get('node.8').get('G2H').get('LHD').get('efficiency.thermal');

  
  
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


!PLANET
load('PLANET2.mat')


Time=rt_time;
Electric_demand=rt_El_demand;
WT_power=WindPower;
PV_power=PVPower;
RES_power=PVPower+WindPower;
Surplus=rt_Surplus;
EB_input=rt_Pump_Liion;
P2G_input=rt_El_PtG;
P2H_input=rt_El_PtH;
RES_Curtailment=rt_RES_Curtailment;
RES_direct_utilization=PVPower+WindPower-rt_Surplus;
EB_output = rt_Turb_Liion; 
CHP_el_production=rt_CHP_electricity; 
DH_demand= rt_DH_demand;
LHD_demand =rt_LHD_demand;
Total_heat_demand=rt_DH_demand+rt_LHD_demand;
P2H_heat=rt_h_P2H_elB_DH+rt_h_P2H_elB_LH+rt_h_P2H_HP_DH+rt_h_P2H_HP_LH;
CHP_heat= rt_chp_heat;
P2G_heat=rt_PtG_heat;
G2H_heat=rt_Gas_Boiler_DH_heat+rt_Gas_Boiler_LHD_heat;

TAB1=table(Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat);
writetable(TAB1, 'Results1.xlsx' )


%Post Processing

%Economic data initialisation 
    
Economy_environment_initialization=fileread('Economy_environment_initialization.txt');
messageJSON = org.json.JSONObject(Economy_environment_initialization);


NG_cost=messageJSON.get('payload').get('NG.cost');
SNG_cost=messageJSON.get('payload').get('SNG.cost');
heat_cost_sell=messageJSON.get('payload').get('heat.cost');
Carbon_tax=messageJSON.get('payload').get('carbon.tax');
Emission_factorNG=messageJSON.get('payload').get('NG.emission.factor')*1000;


lifeT_Wind =messageJSON.get('payload').get('technologies.cost').get('WT') .get('life.time');
lifeT_PV   =messageJSON.get('payload').get('technologies.cost').get('PV') .get('life.time');
lifeT_CHP  =messageJSON.get('payload').get('technologies.cost').get('CHP').get('life.time');
lifeT_HP   =messageJSON.get('payload').get('technologies.cost').get('HP') .get('life.time');
lifeT_elB  =messageJSON.get('payload').get('technologies.cost').get('EH') .get('life.time');
lifeT_Liion=messageJSON.get('payload').get('technologies.cost').get('EB') .get('life.time');
lifeT_PtG  =messageJSON.get('payload').get('technologies.cost').get('P2G').get('life.time');

Capex_Wind =1000* messageJSON.get('payload').get('technologies.cost').get('WT') .get('CAPEX');
Capex_PV   =1000* messageJSON.get('payload').get('technologies.cost').get('PV') .get('CAPEX');
Capex_CHP  =1000* messageJSON.get('payload').get('technologies.cost').get('CHP').get('CAPEX');
Capex_HP   =1000* messageJSON.get('payload').get('technologies.cost').get('HP') .get('CAPEX');
Capex_elB  =1000* messageJSON.get('payload').get('technologies.cost').get('EH') .get('CAPEX');
Capex_Liion=1000* messageJSON.get('payload').get('technologies.cost').get('EB') .get('CAPEX');
Capex_PtG  =1000* messageJSON.get('payload').get('technologies.cost').get('P2G').get('CAPEX'); 

Opex_Wind =Capex_Wind/100* messageJSON.get('payload').get('technologies.cost').get('WT') .get('OPEX');
Opex_PV   =Capex_PV/100*   messageJSON.get('payload').get('technologies.cost').get('PV') .get('OPEX');
Opex_CHP  =Capex_CHP/100*  messageJSON.get('payload').get('technologies.cost').get('CHP').get('OPEX');
Opex_HP   =Capex_HP/100*   messageJSON.get('payload').get('technologies.cost').get('HP') .get('OPEX');
Opex_elB  =Capex_elB/100*  messageJSON.get('payload').get('technologies.cost').get('EH') .get('OPEX');
Opex_Liion=Capex_Liion/100*messageJSON.get('payload').get('technologies.cost').get('EB') .get('OPEX');
Opex_PtG  =Capex_PtG/100*  messageJSON.get('payload').get('technologies.cost').get('P2G').get('OPEX'); 



RES2liion=sum(rt_Pump_Liion)/1000*dt;
RES2PtG=sum(rt_El_PtG)/1000*dt;
RES2PtH=sum(rt_DH_HP_el+rt_LHD_HP_el+rt_DH_elB_el+rt_LHD_elB_el)/1000*dt;
Curtailment=sum(rt_RES_Curtailment)/1000*dt;
El_dem=sum(rt_El_demand)/1000*dt;
LiionProd=sum(rt_Turb_Liion)/1000*dt;
CHPProd=sum(rt_CHP_electricity)/1000*dt;
Th_dem=(sum(rt_DH_demand)+sum(LHD_demand))/1000*dt;

P2HHeat=sum(rt_DH_HP_heat+rt_LHD_HP_heat+rt_DH_elB_heat+rt_LHD_elB_heat)/1000*dt;
P2GHeat=sum(rt_PtG_heat)/1000*dt;
CHPHeat=sum(rt_chp_heat)/1000*dt;
G2HHeat=sum(rt_Gas_Boiler_DH_heat+rt_Gas_Boiler_LHD_heat)/1000*dt;
NG_CHP=sum(rt_chp_fuel)/1000*dt;
NG_P2G=sum(rt_PtG_NG)/1000*dt;
PROD_RES=(PROD_wind+PROD_PV)/1000;

 inv_Wind=((Capex_Wind*Pn_Wind)/lifeT_Wind)+Opex_Wind*Pn_Wind;
 inv_PV=((Capex_PV*Pn_PV)/lifeT_PV)+Opex_PV*Pn_PV;
 inv_CHP=((Capex_CHP*CHP_Pn)/lifeT_CHP)+Opex_CHP*CHP_Pn;
 inv_Liion=((Capex_Liion*Liion_cap)/lifeT_Liion )+Opex_Liion*Liion_cap;
 inv_PtG=((Capex_PtG*PtG_cap)/lifeT_PtG)+Opex_PtG*PtG_cap;
 inv_HP=((Capex_HP*(DH_HP_Cap+LHD_HP_Cap ))/lifeT_HP)+Opex_HP*(DH_HP_Cap+LHD_HP_Cap);
 inv_elB=((Capex_elB*(DH_elB_Cap+LHD_elB_Cap ))/lifeT_HP)+Opex_elB*(DH_elB_Cap+LHD_elB_Cap);


BOLIER_DH_NG=sum(rt_Gas_Boiler_DH_fuel)/1000*dt;
BOLIER_LHD_NG=sum(rt_Gas_Boiler_LHD_fuel)/1000*dt;
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

LCOE=(inv_tot+Fuel_expediture+C_tax_expenditure+SNG_revenue+Heat_revenue)/El_dem/1000;


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







