fid = fopen('file.txt');
% Read all lines & collect in cell array
txt = textscan(fid,'%s','delimiter','\n'); 
% Convert string to numerical value
Val = str2double(txt{1}); 
bess = Val(1);
h1 = Val(2);
h2 = Val(3);
h3_fault = Val(4);
h3_fault_dur = Val(5);