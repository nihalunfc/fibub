// Two made-up example output files written by fibub to show the Gaussian 16 and ORCA 5 layouts. The numbers are
// invented (close to typical values for these molecules) and are not copied from any real calculation.
export const GAUSSIAN_WATER = ` Entering Gaussian System, Link 0=g16
 Input=job.gjf
 ******************************************
 Gaussian 16:  ES64L-G16RevC.01  3-Jul-2019
                 9-Nov-2026 
 ******************************************
 Copyright (c) 1988-2019, Gaussian, Inc.  All Rights Reserved.
 This is a made-up example output written by fibub to show the file format. The numbers are invented.
 ----------------------------------
 #p B3LYP/6-31G(d) opt freq
 ----------------------------------
 Symbolic Z-matrix:
 Charge =  0 Multiplicity = 1
 O                            0.00000     0.00000     0.13000
 H                            0.00000     0.75000    -0.52000
 H                            0.00000    -0.75000    -0.52000
 
 NAtoms=    3 NQM=    3 NQMF=      0 NMMI=      0 NMMIF=      0
                         Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic      Atomic             Coordinates (Angstroms)
 Number     Number       Type             X           Y           Z
 ---------------------------------------------------------------------
      1          8           0        0.000000    0.000000    0.130000
      2          1           0        0.000000    0.750000   -0.520000
      3          1           0        0.000000   -0.750000   -0.520000
 ---------------------------------------------------------------------
    19 basis functions,   38 primitive gaussians,   19 cartesian basis functions
     5 alpha electrons       5 beta electrons
 SCF Done:  E(RB3LYP) =   -76.4061237000     A.U. after   9 cycles
            NFock=  9  Conv=0.43D-08     -V/T= 2.0083
 Step number   1 out of a maximum of  100
         Item               Value     Threshold  Converged?
 Maximum Force            0.021340     0.000450     NO 
 RMS     Force            0.015210     0.000300     NO 
 Maximum Displacement     0.032100     0.001800     NO 
 RMS     Displacement     0.024800     0.001200     NO 
 Predicted change in Energy=-7.640612D-06
                         Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic      Atomic             Coordinates (Angstroms)
 Number     Number       Type             X           Y           Z
 ---------------------------------------------------------------------
      1          8           0        0.000000    0.000000    0.121000
      2          1           0        0.000000    0.760000   -0.484000
      3          1           0        0.000000   -0.760000   -0.484000
 ---------------------------------------------------------------------
    19 basis functions,   38 primitive gaussians,   19 cartesian basis functions
     5 alpha electrons       5 beta electrons
 SCF Done:  E(RB3LYP) =   -76.4087914000     A.U. after   10 cycles
            NFock=  9  Conv=0.43D-08     -V/T= 2.0083
 Step number   2 out of a maximum of  100
         Item               Value     Threshold  Converged?
 Maximum Force            0.002815     0.000450     NO 
 RMS     Force            0.001920     0.000300     NO 
 Maximum Displacement     0.006210     0.001800     NO 
 RMS     Displacement     0.004380     0.001200     NO 
 Predicted change in Energy=-7.640879D-06
                         Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic      Atomic             Coordinates (Angstroms)
 Number     Number       Type             X           Y           Z
 ---------------------------------------------------------------------
      1          8           0        0.000000    0.000000    0.119400
      2          1           0        0.000000    0.761700   -0.477600
      3          1           0        0.000000   -0.761700   -0.477600
 ---------------------------------------------------------------------
    19 basis functions,   38 primitive gaussians,   19 cartesian basis functions
     5 alpha electrons       5 beta electrons
 SCF Done:  E(RB3LYP) =   -76.4089531000     A.U. after   11 cycles
            NFock=  9  Conv=0.43D-08     -V/T= 2.0083
 Step number   3 out of a maximum of  100
         Item               Value     Threshold  Converged?
 Maximum Force            0.000094     0.000450     YES
 RMS     Force            0.000071     0.000300     YES
 Maximum Displacement     0.000302     0.001800     YES
 RMS     Displacement     0.000210     0.001200     YES
 Predicted change in Energy=-7.640895D-06
 Optimization completed.
    -- Stationary point found.
                         Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic      Atomic             Coordinates (Angstroms)
 Number     Number       Type             X           Y           Z
 ---------------------------------------------------------------------
      1          8           0        0.000000    0.000000    0.119400
      2          1           0        0.000000    0.761700   -0.477600
      3          1           0        0.000000   -0.761700   -0.477600
 ---------------------------------------------------------------------
    19 basis functions,   38 primitive gaussians,   19 cartesian basis functions
     5 alpha electrons       5 beta electrons
 SCF Done:  E(RB3LYP) =   -76.4089531000     A.U. after   12 cycles
            NFock=  9  Conv=0.43D-08     -V/T= 2.0083
 **********************************************************************
 
            Population analysis using the SCF Density.
 
 **********************************************************************
 Alpha  occ. eigenvalues -- -19.13512  -0.99712  -0.51893  -0.37124  -0.29287
 Alpha virt. eigenvalues --   0.06571   0.15182   0.55204   0.59811   0.87714
 Alpha virt. eigenvalues --   0.90266   1.02481   1.14702   1.25417   1.71963
 Alpha virt. eigenvalues --   1.82034   1.90371   2.56398   3.49521
 Electronic spatial extent (au):  <R**2>=             19.1234
 Charge=        0.0000 electrons
 Dipole moment (field-independent basis, Debye):
    X=              0.0000    Y=              0.0000    Z=             -2.0941  Tot=              2.0941
 Harmonic frequencies (cm**-1), IR intensities (KM/Mole), Raman scattering
 activities (A**4/AMU), depolarization ratios for plane and unpolarized
 incident light, reduced masses (AMU), force constants (mDyne/A),
 and normal coordinates:
                      1                      2                      3
                      A                      A                      A
 Frequencies --   1712.9000              3726.8000              3848.6000
 Red. masses --      1.0000                 1.1000                 1.2000
 Frc consts  --      0.5000                 0.7000                 0.9000
 IR Inten    --     74.6000                 2.1000                18.4000
  Atom  AN      X      Y      Z        X      Y      Z        X      Y      Z  
     1   8   0.00   0.00   0.10     0.00   0.00   0.10     0.00   0.00   0.10  
     2   1   0.00   0.00   0.10     0.00   0.00   0.10     0.00   0.00   0.10  
     3   1   0.00   0.00   0.10     0.00   0.00   0.10     0.00   0.00   0.10  
 
 -------------------
 - Thermochemistry -
 -------------------
 Temperature   298.150 Kelvin.  Pressure   1.00000 Atm.
 Zero-point correction=                   0.021134 (Hartree/Particle)
 Thermal correction to Energy=            0.023970
 Thermal correction to Enthalpy=          0.024914
 Thermal correction to Gibbs Free Energy= 0.003492
 Sum of electronic and zero-point Energies=          -76.387819
 Sum of electronic and thermal Energies=             -76.384983
 Sum of electronic and thermal Enthalpies=           -76.384039
 Sum of electronic and thermal Free Energies=        -76.405461
 Normal termination of Gaussian 16 at Mon Nov  9 10:00:00 2026.
`;

export const ORCA_FORMALDEHYDE = `
                                 *****************
                                 * O   R   C   A *
                                 *****************

                            Program Version 5.0.4 -  RELEASE  -

 This is a made-up example output written by fibub to show the file format. The numbers are invented.

================================================================================
                                       INPUT FILE
================================================================================
NAME = job.inp
|  1> ! B3LYP def2-SVP Opt Freq
|  2> * xyz 0 1
|  3> C      0.000000    0.000000   -0.530000
|  4> O      0.000000    0.000000    0.680000
|  5> H      0.000000    0.950000   -1.120000
|  6> H      0.000000   -0.950000   -1.120000
|  7> *
|  8> 
|                         ****END OF INPUT****
================================================================================

                       *****************************
                      *  Geometry Optimization Run  *
                       *****************************

Geometry optimization settings:
Update method            Update   .... BFGS

Convergence Tolerances:
Energy Change            TolE      ....  5.0000e-06 Eh
Max. Gradient            TolMAXG   ....  3.0000e-04 Eh/bohr
RMS Gradient             TolRMSG   ....  1.0000e-04 Eh/bohr
Max. Displacement        TolMAXD   ....  4.0000e-03 bohr
RMS Displacement         TolRMSD   ....  2.0000e-03 bohr

         *************************************************************
         *                GEOMETRY OPTIMIZATION CYCLE   1            *
         *************************************************************
---------------------------------
CARTESIAN COORDINATES (ANGSTROEM)
---------------------------------
  C        0.000000    0.000000   -0.530000
  O        0.000000    0.000000    0.680000
  H        0.000000    0.950000   -1.120000
  H        0.000000   -0.950000   -1.120000

----------------------------
CARTESIAN COORDINATES (A.U.)
----------------------------
  NO LB      ZA    FRAG     MASS         X           Y           Z
  0 C     6.0000    0     12.000    0.000000    0.000000   -1.001555
  1 O     8.0000    0     16.000    0.000000    0.000000    1.285014
  2 H     1.0000    0      1.008    0.000000    1.795241   -2.116494
  3 H     1.0000    0      1.008    0.000000   -1.795241   -2.116494

-------------------------------------------------------------------------------
                        ORCA SCF
-------------------------------------------------------------------------------
 Total Charge           Charge          ....    0
 Multiplicity           Mult            ....    1
 Number of Electrons    NEL             ....   16

 Density Functional     Method          .... DFT(GTOs)

--------------
SCF ITERATIONS
--------------
ITER       Energy         Delta-E        Max-DP      RMS-DP      [F,P]     Damp
  0   -114.4098812000   0.000000000000 0.01000000  0.00100000  0.0500000 0.7000
  1   -114.4197812000  -0.009900000000 0.00100000  0.00010000  0.0050000 0.7000

               *****************************************************
               *                     SUCCESS                       *
               *           SCF CONVERGED AFTER   9 CYCLES          *
               *****************************************************

----------------
TOTAL SCF ENERGY
----------------

Total Energy       :          -114.41988120 Eh            -3113.52358 eV

---------------
SCF CONVERGENCE
---------------

  Last Energy change         ...   -1.2345e-09  Tolerance :   1.0000e-08
  Last MAX-Density change    ...    1.2345e-06  Tolerance :   1.0000e-07
  Last RMS-Density change    ...    1.2345e-08  Tolerance :   5.0000e-09

-------------------------   --------------------
FINAL SINGLE POINT ENERGY     -114.419881200000
-------------------------   --------------------

                                .--------------------.
          ----------------------|Geometry convergence|-------------------------
          Item                value                   Tolerance       Converged
          ---------------------------------------------------------------------
          RMS gradient           0.0068100000            0.0001000000      NO
          MAX gradient           0.0124300000            0.0003000000      NO
          RMS step               0.0118000000            0.0020000000      NO
          MAX step               0.0219000000            0.0040000000      NO
          ........................................................
          Max(Bonds)      0.0012      Max(Angles)    0.05
          ---------------------------------------------------------------------

         *************************************************************
         *                GEOMETRY OPTIMIZATION CYCLE   2            *
         *************************************************************
---------------------------------
CARTESIAN COORDINATES (ANGSTROEM)
---------------------------------
  C        0.000000    0.000000   -0.528100
  O        0.000000    0.000000    0.676200
  H        0.000000    0.938100   -1.112400
  H        0.000000   -0.938100   -1.112400

----------------------------
CARTESIAN COORDINATES (A.U.)
----------------------------
  NO LB      ZA    FRAG     MASS         X           Y           Z
  0 C     6.0000    0     12.000    0.000000    0.000000   -0.997965
  1 O     8.0000    0     16.000    0.000000    0.000000    1.277833
  2 H     1.0000    0      1.008    0.000000    1.772753   -2.102132
  3 H     1.0000    0      1.008    0.000000   -1.772753   -2.102132

--------------
SCF ITERATIONS
--------------
ITER       Energy         Delta-E        Max-DP      RMS-DP      [F,P]     Damp
  0   -114.4115290000   0.000000000000 0.01000000  0.00100000  0.0500000 0.7000
  1   -114.4214290000  -0.009900000000 0.00100000  0.00010000  0.0050000 0.7000

               *****************************************************
               *                     SUCCESS                       *
               *           SCF CONVERGED AFTER   9 CYCLES          *
               *****************************************************

----------------
TOTAL SCF ENERGY
----------------

Total Energy       :          -114.42152900 Eh            -3113.56842 eV

---------------
SCF CONVERGENCE
---------------

  Last Energy change         ...   -1.2345e-09  Tolerance :   1.0000e-08
  Last MAX-Density change    ...    1.2345e-06  Tolerance :   1.0000e-07
  Last RMS-Density change    ...    1.2345e-08  Tolerance :   5.0000e-09

-------------------------   --------------------
FINAL SINGLE POINT ENERGY     -114.421529000000
-------------------------   --------------------

                                .--------------------.
          ----------------------|Geometry convergence|-------------------------
          Item                value                   Tolerance       Converged
          ---------------------------------------------------------------------
          Energy change         -0.0016478000            0.0000050000      NO
          RMS gradient           0.0004120000            0.0001000000      NO
          MAX gradient           0.0009010000            0.0003000000      NO
          RMS step               0.0015100000            0.0020000000      YES
          MAX step               0.0030100000            0.0040000000      YES
          ........................................................
          Max(Bonds)      0.0012      Max(Angles)    0.05
          ---------------------------------------------------------------------

         *************************************************************
         *                GEOMETRY OPTIMIZATION CYCLE   3            *
         *************************************************************
---------------------------------
CARTESIAN COORDINATES (ANGSTROEM)
---------------------------------
  C        0.000000    0.000000   -0.527600
  O        0.000000    0.000000    0.675400
  H        0.000000    0.936500   -1.111500
  H        0.000000   -0.936500   -1.111500

----------------------------
CARTESIAN COORDINATES (A.U.)
----------------------------
  NO LB      ZA    FRAG     MASS         X           Y           Z
  0 C     6.0000    0     12.000    0.000000    0.000000   -0.997020
  1 O     8.0000    0     16.000    0.000000    0.000000    1.276322
  2 H     1.0000    0      1.008    0.000000    1.769729   -2.100431
  3 H     1.0000    0      1.008    0.000000   -1.769729   -2.100431

--------------
SCF ITERATIONS
--------------
ITER       Energy         Delta-E        Max-DP      RMS-DP      [F,P]     Damp
  0   -114.4115328000   0.000000000000 0.01000000  0.00100000  0.0500000 0.7000
  1   -114.4214328000  -0.009900000000 0.00100000  0.00010000  0.0050000 0.7000

               *****************************************************
               *                     SUCCESS                       *
               *           SCF CONVERGED AFTER   9 CYCLES          *
               *****************************************************

----------------
TOTAL SCF ENERGY
----------------

Total Energy       :          -114.42153280 Eh            -3113.56852 eV

---------------
SCF CONVERGENCE
---------------

  Last Energy change         ...   -1.2345e-09  Tolerance :   1.0000e-08
  Last MAX-Density change    ...    1.2345e-06  Tolerance :   1.0000e-07
  Last RMS-Density change    ...    1.2345e-08  Tolerance :   5.0000e-09

----------------
ORBITAL ENERGIES
----------------

  NO   OCC          E(Eh)            E(eV) 
   0   2.0000       -19.148210        -521.0493 
   1   2.0000       -10.277350        -279.6609 
   2   2.0000        -1.058020         -28.7902 
   3   2.0000        -0.639210         -17.3938 
   4   2.0000        -0.482170         -13.1205 
   5   2.0000        -0.441080         -12.0024 
   6   2.0000        -0.389620         -10.6021 
   7   2.0000        -0.266050          -7.2396 
   8   0.0000        -0.038120          -1.0373 
   9   0.0000         0.081740           2.2243 
  10   0.0000         0.158930           4.3247 
  11   0.0000         0.213060           5.7977 
  12   0.0000         0.375110          10.2073 
  13   0.0000         0.440620          11.9899 
  14   0.0000         0.472850          12.8669 
  15   0.0000         0.508330          13.8324 

------------------------------------------------------------------------------

-------------------------   --------------------
FINAL SINGLE POINT ENERGY     -114.421532800000
-------------------------   --------------------

                                .--------------------.
          ----------------------|Geometry convergence|-------------------------
          Item                value                   Tolerance       Converged
          ---------------------------------------------------------------------
          Energy change         -0.0000038000            0.0000050000      YES
          RMS gradient           0.0000330000            0.0001000000      YES
          MAX gradient           0.0000710000            0.0003000000      YES
          RMS step               0.0002150000            0.0020000000      YES
          MAX step               0.0004020000            0.0040000000      YES
          ........................................................
          Max(Bonds)      0.0012      Max(Angles)    0.05
          ---------------------------------------------------------------------

                    ***********************HURRAY********************
                    ***        THE OPTIMIZATION HAS CONVERGED     ***
                    *************************************************

                    ******************************************************
                 *** FINAL ENERGY EVALUATION AT THE STATIONARY POINT ***
                    ******************************************************

-------------
DIPOLE MOMENT
-------------
                                X             Y             Z
Electronic contribution:        0.00000       0.00000      -0.26811
Nuclear contribution   :        0.00000       0.00000      -0.62560
                        -----------------------------------------
Total Dipole Moment    :        0.00000       0.00000      -0.89372
                        -----------------------------------------
Magnitude (a.u.)       :        0.89372
Magnitude (Debye)      :        2.27160

-----------------------
VIBRATIONAL FREQUENCIES
-----------------------

Scaling factor for frequencies =  1.000000000  (already applied!)

   0:         0.00 cm**-1
   1:         0.00 cm**-1
   2:         0.00 cm**-1
   3:         0.00 cm**-1
   4:         0.00 cm**-1
   5:         0.00 cm**-1
   6:      1190.40 cm**-1
   7:      1267.90 cm**-1
   8:      1539.20 cm**-1
   9:      1828.70 cm**-1
  10:      2873.50 cm**-1
  11:      2931.80 cm**-1

-----------
IR SPECTRUM
-----------

 Mode   freq       eps      Int      T**2         TX        TY        TZ
       cm**-1   L/(mol*cm) km/mol    a.u.
----------------------------------------------------------------------------
  6:    1190.40   0.000720     3.60  0.000138  ( 0.000000  0.000000  0.011767)
  7:    1267.90   0.002180    10.90  0.000419  ( 0.000000  0.000000  0.020475)
  8:    1539.20   0.001840     9.20  0.000354  ( 0.000000  0.000000  0.018811)
  9:    1828.70   0.027960   139.80  0.005377  ( 0.000000  0.000000  0.073328)
 10:    2873.50   0.012260    61.30  0.002358  ( 0.000000  0.000000  0.048556)
 11:    2931.80   0.029500   147.50  0.005673  ( 0.000000  0.000000  0.075320)

* The epsilon (eps) is given for a Dirac delta lineshape.

--------------------------
THERMOCHEMISTRY AT 298.15K
--------------------------

Temperature         ... 298.15 K
Pressure            ... 1.00 atm
Total Mass          ... 30.03 AMU

------------
INNER ENERGY
------------

Summary of contributions to the inner energy U:
Electronic energy                ...    -114.42153280 Eh
Zero point energy                ...       0.02651200 Eh      16.64 kcal/mol
Thermal vibrational correction   ...       0.00003746 Eh       0.02 kcal/mol
Thermal rotational correction    ...       0.00141627 Eh       0.89 kcal/mol
Thermal translational correction ...       0.00141627 Eh       0.89 kcal/mol
-----------------------------------------------------------------------
Total thermal energy                    -114.39215080 Eh

--------
ENTHALPY
--------

Total free energy                 ...    -114.39215080 Eh
Thermal Enthalpy correction       ...       0.00094400 Eh       0.59 kcal/mol
-----------------------------------------------------------------------
Total Enthalpy                    ...    -114.39120680 Eh

-------
ENTROPY
-------

Electronic entropy                ...       0.00000000 Eh       0.00 kcal/mol
Vibrational entropy               ...       0.00126985 Eh       0.00 kcal/mol
Rotational entropy                ...       0.00761910 Eh       0.00 kcal/mol
Translational entropy             ...       0.01650805 Eh       0.00 kcal/mol
-----------------------------------------------------------------------
Final entropy term                ...       0.02539700 Eh      15.94 kcal/mol

-------------------
GIBBS FREE ENERGY
-------------------

Total enthalpy                    ...    -114.39120680 Eh
Total entropy correction          ...      -0.02539700 Eh     -15.94 kcal/mol
-----------------------------------------------------------------------
Final Gibbs free energy         ...    -114.41660380 Eh

For completeness - the Gibbs free energy minus the electronic energy
G-E(el)                           ...       0.00492900 Eh       3.09 kcal/mol

                             ****ORCA TERMINATED NORMALLY****
TOTAL RUN TIME: 0 days 0 hours 0 minutes 12 seconds 345 msec
`;
