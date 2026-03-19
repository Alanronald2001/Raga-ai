import type { Patient } from '@raga/shared-types'

export const patients: Patient[] = [
  {
    id: 'p001', name: 'Arjun Mehta', age: 45, gender: 'male',
    status: 'active', department: 'Cardiology', bloodGroup: 'B+',
    phone: '+91 98765 43210', email: 'arjun.mehta@email.com',
    address: '12 MG Road, Bengaluru, KA 560001',
    lastVisit: '2024-03-10', nextAppointment: '2024-04-05',
    vitals: { bloodPressure: '138/88', heartRate: 78, temperature: 98.6, oxygenSaturation: 97, weight: 82 },
    notes: 'Hypertension — on Amlodipine 5mg. Monitor BP weekly.'
  },
  {
    id: 'p002', name: 'Priya Nair', age: 32, gender: 'female',
    status: 'stable', department: 'Obstetrics', bloodGroup: 'O+',
    phone: '+91 91234 56789', email: 'priya.nair@email.com',
    address: '7 Jubilee Hills, Hyderabad, TS 500033',
    lastVisit: '2024-03-15', nextAppointment: '2024-03-29',
    vitals: { bloodPressure: '110/70', heartRate: 82, temperature: 98.4, oxygenSaturation: 99, weight: 64 },
    notes: '28 weeks pregnant. Routine prenatal care.'
  },
  {
    id: 'p003', name: 'Ravi Shankar', age: 67, gender: 'male',
    status: 'critical', department: 'Neurology', bloodGroup: 'A-',
    phone: '+91 99887 76655', email: 'ravi.shankar@email.com',
    address: '3 Anna Salai, Chennai, TN 600002',
    lastVisit: '2024-03-18', nextAppointment: '2024-03-21',
    vitals: { bloodPressure: '160/100', heartRate: 92, temperature: 99.1, oxygenSaturation: 94, weight: 71 },
    notes: 'Post-stroke recovery. Speech therapy ongoing.'
  },
  {
    id: 'p004', name: 'Sunita Rao', age: 54, gender: 'female',
    status: 'discharged', department: 'Orthopedics', bloodGroup: 'AB+',
    phone: '+91 87654 32109', email: 'sunita.rao@email.com',
    address: '45 FC Road, Pune, MH 411004',
    lastVisit: '2024-03-01', nextAppointment: '2024-04-15',
    vitals: { bloodPressure: '122/80', heartRate: 70, temperature: 98.2, oxygenSaturation: 98, weight: 68 },
    notes: 'Right knee replacement. Physiotherapy 3x/week.'
  },
  {
    id: 'p005', name: 'Kiran Patel', age: 28, gender: 'male',
    status: 'active', department: 'Dermatology', bloodGroup: 'O-',
    phone: '+91 76543 21098', email: 'kiran.patel@email.com',
    address: '89 CG Road, Ahmedabad, GJ 380009',
    lastVisit: '2024-03-12', nextAppointment: '2024-04-01',
    vitals: { bloodPressure: '118/76', heartRate: 68, temperature: 98.6, oxygenSaturation: 99, weight: 74 },
    notes: 'Severe psoriasis — Methotrexate therapy.'
  },
  {
    id: 'p006', name: 'Meena Krishnan', age: 41, gender: 'female',
    status: 'active', department: 'Endocrinology', bloodGroup: 'B-',
    phone: '+91 65432 10987', email: 'meena.k@email.com',
    address: '22 Residency Road, Bengaluru, KA 560025',
    lastVisit: '2024-03-08', nextAppointment: '2024-04-10',
    vitals: { bloodPressure: '126/82', heartRate: 75, temperature: 98.5, oxygenSaturation: 98, weight: 61 },
    notes: 'Type 2 Diabetes. HbA1c 7.8 — adjust Metformin.'
  },
  {
    id: 'p007', name: 'Deepak Verma', age: 59, gender: 'male',
    status: 'stable', department: 'Pulmonology', bloodGroup: 'A+',
    phone: '+91 54321 09876', email: 'deepak.verma@email.com',
    address: '5 Connaught Place, New Delhi, DL 110001',
    lastVisit: '2024-03-14', nextAppointment: '2024-03-28',
    vitals: { bloodPressure: '132/86', heartRate: 80, temperature: 98.8, oxygenSaturation: 95, weight: 79 },
    notes: 'COPD Stage 2. Bronchodilator prescribed.'
  },
  {
    id: 'p008', name: 'Anjali Singh', age: 36, gender: 'female',
    status: 'active', department: 'Psychiatry', bloodGroup: 'O+',
    phone: '+91 43210 98765', email: 'anjali.singh@email.com',
    address: '18 Park Street, Kolkata, WB 700016',
    lastVisit: '2024-03-11', nextAppointment: '2024-03-25',
    vitals: { bloodPressure: '114/72', heartRate: 72, temperature: 98.4, oxygenSaturation: 99, weight: 57 },
    notes: 'Generalised anxiety disorder. CBT sessions ongoing.'
  },
  {
    id: 'p009', name: 'Suresh Iyer', age: 72, gender: 'male',
    status: 'critical', department: 'Cardiology', bloodGroup: 'B+',
    phone: '+91 32109 87654', email: 'suresh.iyer@email.com',
    address: '9 Adyar, Chennai, TN 600020',
    lastVisit: '2024-03-19', nextAppointment: '2024-03-20',
    vitals: { bloodPressure: '170/105', heartRate: 98, temperature: 99.4, oxygenSaturation: 92, weight: 76 },
    notes: 'Acute MI — post-cath monitoring in CCU.'
  },
  {
    id: 'p010', name: 'Fatima Shaikh', age: 29, gender: 'female',
    status: 'active', department: 'Ophthalmology', bloodGroup: 'AB-',
    phone: '+91 21098 76543', email: 'fatima.s@email.com',
    address: '33 Bandra West, Mumbai, MH 400050',
    lastVisit: '2024-03-07', nextAppointment: '2024-04-07',
    vitals: { bloodPressure: '112/70', heartRate: 66, temperature: 98.3, oxygenSaturation: 99, weight: 53 },
    notes: 'Progressive myopia. Orthokeratology lenses fitted.'
  },
  {
    id: 'p011', name: 'Rahul Gupta', age: 48, gender: 'male',
    status: 'stable', department: 'Gastroenterology', bloodGroup: 'A+',
    phone: '+91 90001 11222', email: 'rahul.gupta@email.com',
    address: '67 Lajpat Nagar, New Delhi, DL 110024',
    lastVisit: '2024-03-09', nextAppointment: '2024-04-02',
    vitals: { bloodPressure: '128/84', heartRate: 74, temperature: 98.6, oxygenSaturation: 97, weight: 85 },
    notes: 'Chronic gastritis. PPI therapy. Avoid NSAIDs.'
  },
  {
    id: 'p012', name: 'Lakshmi Reddy', age: 63, gender: 'female',
    status: 'active', department: 'Nephrology', bloodGroup: 'O+',
    phone: '+91 90002 22333', email: 'lakshmi.r@email.com',
    address: '14 Banjara Hills, Hyderabad, TS 500034',
    lastVisit: '2024-03-16', nextAppointment: '2024-03-30',
    vitals: { bloodPressure: '144/92', heartRate: 77, temperature: 98.7, oxygenSaturation: 96, weight: 66 },
    notes: 'CKD Stage 3. Restrict protein. Monitor creatinine.'
  },
  {
    id: 'p013', name: 'Amit Joshi', age: 38, gender: 'male',
    status: 'discharged', department: 'General Surgery', bloodGroup: 'B+',
    phone: '+91 90003 33444', email: 'amit.joshi@email.com',
    address: '28 Shivaji Nagar, Pune, MH 411005',
    lastVisit: '2024-02-28', nextAppointment: '2024-04-20',
    vitals: { bloodPressure: '120/78', heartRate: 69, temperature: 98.2, oxygenSaturation: 98, weight: 78 },
    notes: 'Appendectomy — laparoscopic. Full recovery expected.'
  },
  {
    id: 'p014', name: 'Nandini Das', age: 25, gender: 'female',
    status: 'active', department: 'Hematology', bloodGroup: 'A-',
    phone: '+91 90004 44555', email: 'nandini.das@email.com',
    address: '55 Salt Lake, Kolkata, WB 700091',
    lastVisit: '2024-03-13', nextAppointment: '2024-03-27',
    vitals: { bloodPressure: '108/68', heartRate: 88, temperature: 98.9, oxygenSaturation: 97, weight: 49 },
    notes: 'Sickle cell anaemia. Hydroxyurea 500mg daily.'
  },
  {
    id: 'p015', name: 'Vijay Kumar', age: 55, gender: 'male',
    status: 'stable', department: 'Oncology', bloodGroup: 'O-',
    phone: '+91 90005 55666', email: 'vijay.k@email.com',
    address: '40 Whitefield, Bengaluru, KA 560066',
    lastVisit: '2024-03-17', nextAppointment: '2024-03-31',
    vitals: { bloodPressure: '130/85', heartRate: 76, temperature: 98.5, oxygenSaturation: 96, weight: 72 },
    notes: 'Stage 2 colon cancer. Cycle 4 of FOLFOX chemo.'
  },
  {
    id: 'p016', name: 'Pooja Sharma', age: 31, gender: 'female',
    status: 'active', department: 'Rheumatology', bloodGroup: 'B+',
    phone: '+91 90006 66777', email: 'pooja.sharma@email.com',
    address: '77 Malviya Nagar, Jaipur, RJ 302017',
    lastVisit: '2024-03-06', nextAppointment: '2024-04-06',
    vitals: { bloodPressure: '116/74', heartRate: 71, temperature: 98.3, oxygenSaturation: 99, weight: 58 },
    notes: 'Rheumatoid arthritis. Methotrexate + Hydroxychloroquine.'
  },
  {
    id: 'p017', name: 'Gopal Pillai', age: 70, gender: 'male',
    status: 'critical', department: 'Neurology', bloodGroup: 'A+',
    phone: '+91 90007 77888', email: 'gopal.pillai@email.com',
    address: '6 Thiruvananthapuram, KL 695001',
    lastVisit: '2024-03-19', nextAppointment: '2024-03-22',
    vitals: { bloodPressure: '168/102', heartRate: 95, temperature: 99.2, oxygenSaturation: 93, weight: 68 },
    notes: 'Parkinson's — freezing episodes. Levodopa adjusted.'
  },
  {
    id: 'p018', name: 'Rekha Bose', age: 44, gender: 'female',
    status: 'stable', department: 'Cardiology', bloodGroup: 'AB+',
    phone: '+91 90008 88999', email: 'rekha.bose@email.com',
    address: '19 Alipore, Kolkata, WB 700027',
    lastVisit: '2024-03-10', nextAppointment: '2024-04-08',
    vitals: { bloodPressure: '124/80', heartRate: 73, temperature: 98.6, oxygenSaturation: 98, weight: 63 },
    notes: 'Mitral valve prolapse — echo scheduled quarterly.'
  },
  {
    id: 'p019', name: 'Santosh Yadav', age: 52, gender: 'male',
    status: 'active', department: 'Urology', bloodGroup: 'O+',
    phone: '+91 90009 99000', email: 'santosh.y@email.com',
    address: '31 Hazratganj, Lucknow, UP 226001',
    lastVisit: '2024-03-05', nextAppointment: '2024-04-03',
    vitals: { bloodPressure: '136/88', heartRate: 79, temperature: 98.7, oxygenSaturation: 97, weight: 88 },
    notes: 'BPH — Tamsulosin 0.4mg. PSA borderline — monitor.'
  },
  {
    id: 'p020', name: 'Ananya Menon', age: 19, gender: 'female',
    status: 'active', department: 'Pediatrics', bloodGroup: 'B-',
    phone: '+91 90010 10101', email: 'ananya.m@email.com',
    address: '8 Koramangala, Bengaluru, KA 560034',
    lastVisit: '2024-03-18', nextAppointment: '2024-04-18',
    vitals: { bloodPressure: '110/68', heartRate: 64, temperature: 98.2, oxygenSaturation: 99, weight: 52 },
    notes: 'Juvenile idiopathic arthritis — transitioned to adult care.'
  },
  {
    id: 'p021', name: 'Harish Chandra', age: 60, gender: 'male',
    status: 'discharged', department: 'Pulmonology', bloodGroup: 'A+',
    phone: '+91 90011 11222', email: 'harish.c@email.com',
    address: '50 Civil Lines, Nagpur, MH 440001',
    lastVisit: '2024-03-03', nextAppointment: '2024-04-25',
    vitals: { bloodPressure: '128/82', heartRate: 72, temperature: 98.4, oxygenSaturation: 96, weight: 77 },
    notes: 'Community-acquired pneumonia — completed antibiotic course.'
  },
  {
    id: 'p022', name: 'Savitha Gowda', age: 37, gender: 'female',
    status: 'active', department: 'Endocrinology', bloodGroup: 'O+',
    phone: '+91 90012 22333', email: 'savitha.g@email.com',
    address: '25 Mysuru Road, Bengaluru, KA 560026',
    lastVisit: '2024-03-14', nextAppointment: '2024-04-11',
    vitals: { bloodPressure: '118/76', heartRate: 74, temperature: 98.5, oxygenSaturation: 99, weight: 59 },
    notes: 'Hypothyroidism — Levothyroxine 75mcg. TSH normalising.'
  },
  {
    id: 'p023', name: 'Prakash Naidu', age: 49, gender: 'male',
    status: 'stable', department: 'Orthopedics', bloodGroup: 'B+',
    phone: '+91 90013 33444', email: 'prakash.n@email.com',
    address: '11 Visakhapatnam, AP 530001',
    lastVisit: '2024-03-08', nextAppointment: '2024-04-04',
    vitals: { bloodPressure: '130/84', heartRate: 76, temperature: 98.6, oxygenSaturation: 98, weight: 84 },
    notes: 'Lumbar disc herniation L4-L5. Physiotherapy 5 weeks.'
  },
  {
    id: 'p024', name: 'Divya Ramesh', age: 27, gender: 'female',
    status: 'active', department: 'Dermatology', bloodGroup: 'A-',
    phone: '+91 90014 44555', email: 'divya.r@email.com',
    address: '3 T Nagar, Chennai, TN 600017',
    lastVisit: '2024-03-11', nextAppointment: '2024-04-09',
    vitals: { bloodPressure: '112/72', heartRate: 68, temperature: 98.3, oxygenSaturation: 99, weight: 55 },
    notes: 'Acne vulgaris — Isotretinoin 20mg. Monthly liver check.'
  },
  {
    id: 'p025', name: 'Mohan Lal', age: 66, gender: 'male',
    status: 'critical', department: 'Oncology', bloodGroup: 'O+',
    phone: '+91 90015 55666', email: 'mohan.lal@email.com',
    address: '17 Amritsar, PB 143001',
    lastVisit: '2024-03-19', nextAppointment: '2024-03-23',
    vitals: { bloodPressure: '150/96', heartRate: 94, temperature: 99.0, oxygenSaturation: 93, weight: 65 },
    notes: 'Stage 3B lung cancer. Palliative chemo — Carboplatin/Paclitaxel.'
  },
  {
    id: 'p026', name: 'Usha Pillai', age: 58, gender: 'female',
    status: 'stable', department: 'Nephrology', bloodGroup: 'AB+',
    phone: '+91 90016 66777', email: 'usha.p@email.com',
    address: '42 Thrissur, KL 680001',
    lastVisit: '2024-03-15', nextAppointment: '2024-03-29',
    vitals: { bloodPressure: '140/90', heartRate: 78, temperature: 98.6, oxygenSaturation: 96, weight: 70 },
    notes: 'Dialysis 3x/week. AV fistula functioning well.'
  },
  {
    id: 'p027', name: 'Naveen Bhat', age: 34, gender: 'male',
    status: 'active', department: 'General Surgery', bloodGroup: 'B+',
    phone: '+91 90017 77888', email: 'naveen.b@email.com',
    address: '62 Mangaluru, KA 575001',
    lastVisit: '2024-03-12', nextAppointment: '2024-04-12',
    vitals: { bloodPressure: '120/78', heartRate: 70, temperature: 98.4, oxygenSaturation: 99, weight: 75 },
    notes: 'Inguinal hernia repair — laparoscopic. Recovery good.'
  },
  {
    id: 'p028', name: 'Kavitha Subramanian', age: 46, gender: 'female',
    status: 'active', department: 'Psychiatry', bloodGroup: 'O-',
    phone: '+91 90018 88999', email: 'kavitha.s@email.com',
    address: '36 Coimbatore, TN 641001',
    lastVisit: '2024-03-10', nextAppointment: '2024-03-24',
    vitals: { bloodPressure: '116/74', heartRate: 73, temperature: 98.5, oxygenSaturation: 99, weight: 62 },
    notes: 'Bipolar I — stable on Lithium 900mg. Mood diary maintained.'
  },
  {
    id: 'p029', name: 'Rajendra Prasad', age: 74, gender: 'male',
    status: 'stable', department: 'Cardiology', bloodGroup: 'A+',
    phone: '+91 90019 99000', email: 'rajendra.p@email.com',
    address: '1 Patna, BR 800001',
    lastVisit: '2024-03-16', nextAppointment: '2024-03-30',
    vitals: { bloodPressure: '142/88', heartRate: 80, temperature: 98.6, oxygenSaturation: 95, weight: 73 },
    notes: 'AF — Warfarin anticoagulation. INR 2.4 — therapeutic.'
  },
  {
    id: 'p030', name: 'Shreya Agarwal', age: 22, gender: 'female',
    status: 'active', department: 'Hematology', bloodGroup: 'B-',
    phone: '+91 90020 00111', email: 'shreya.a@email.com',
    address: '88 Indore, MP 452001',
    lastVisit: '2024-03-13', nextAppointment: '2024-04-13',
    vitals: { bloodPressure: '106/66', heartRate: 86, temperature: 98.8, oxygenSaturation: 98, weight: 47 },
    notes: 'Iron-deficiency anaemia. IV iron infusion course started.'
  },
]