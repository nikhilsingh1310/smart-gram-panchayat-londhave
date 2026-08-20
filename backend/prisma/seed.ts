import { PrismaClient, Role, ContentType, ContentStatus, ComplaintCategory, ComplaintPriority, ComplaintStatus, TaxType, TaxStatus, CertType, CertStatus, ScheduleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed database for Smart Gram Panchayat Londhave...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.surveyOption.deleteMany();
  await prisma.surveyPoll.deleteMany();
  await prisma.utilitySchedule.deleteMany();
  await prisma.certificateApp.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.taxBill.deleteMany();
  await prisma.complaintHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.contentTranslation.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.villageStat.deleteMany();
  await prisma.villageFacility.deleteMany();
  await prisma.panchayatMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  // 1. Departments
  const deptAdmin = await prisma.department.create({ data: { name: 'General Administration', code: 'ADMIN', description: 'Overall Gram Panchayat governance' } });
  const deptWater = await prisma.department.create({ data: { name: 'Water Supply', code: 'WATER', description: 'Pipeline maintenance and supply schedules' } });
  const deptSanitation = await prisma.department.create({ data: { name: 'Sanitation & Health', code: 'SANITATION', description: 'Garbage collection, drainage, and cleanliness' } });
  const deptElectrical = await prisma.department.create({ data: { name: 'Electrical & Lighting', code: 'ELECTRICAL', description: 'Streetlights and solar installations' } });

  // Passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  // 2. Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@londhavegp.in',
      name: 'System Super Admin',
      role: Role.SUPER_ADMIN,
      passwordHash: adminPassword,
      preferredLang: 'en',
    }
  });

  const sarpanchUser = await prisma.user.create({
    data: {
      email: 'sarpanch@londhavegp.in',
      mobile: '9422200001',
      name: 'सौ. संगीता सुभाष पाटील (Sangita S. Patil)',
      role: Role.GP_ADMIN,
      passwordHash: adminPassword,
      departmentId: deptAdmin.id,
      preferredLang: 'mr',
    }
  });

  const gramsevakUser = await prisma.user.create({
    data: {
      email: 'gramsevak@londhavegp.in',
      mobile: '9422200002',
      name: 'श्री. ए. बी. चव्हाण (A. B. Chavan)',
      role: Role.GP_ADMIN,
      passwordHash: adminPassword,
      departmentId: deptAdmin.id,
      preferredLang: 'mr',
    }
  });

  const staffWater = await prisma.user.create({
    data: {
      email: 'waterstaff@londhavegp.in',
      mobile: '9422200003',
      name: 'श्री. विकास पाटील (Vikas Patil)',
      role: Role.EMPLOYEE,
      passwordHash: staffPassword,
      departmentId: deptWater.id,
      preferredLang: 'mr',
    }
  });

  const staffSanitation = await prisma.user.create({
    data: {
      email: 'sanitationstaff@londhavegp.in',
      mobile: '9422200004',
      name: 'श्री. सचिन मोरे (Sachin More)',
      role: Role.EMPLOYEE,
      passwordHash: staffPassword,
      departmentId: deptSanitation.id,
      preferredLang: 'mr',
    }
  });

  const citizenRamesh = await prisma.user.create({
    data: {
      mobile: '9876543210',
      name: 'रमेश आनंद पाटील (Ramesh Patil)',
      role: Role.CITIZEN,
      houseNo: 'H-102',
      wardNo: '1',
      address: 'Main Bazaar Road, Ward 1, Londhave',
      preferredLang: 'mr',
    }
  });

  const citizenSunita = await prisma.user.create({
    data: {
      mobile: '9876543211',
      name: 'सुनीता एकनाथ शिंदे (Sunita Shinde)',
      role: Role.CITIZEN,
      houseNo: 'H-205',
      wardNo: '2',
      address: 'Near ZP School, Ward 2, Londhave',
      preferredLang: 'mr',
    }
  });

  const citizenPrakash = await prisma.user.create({
    data: {
      mobile: '9876543212',
      name: 'प्रकाश दगडू चौधरी (Prakash Chaudhari)',
      role: Role.CITIZEN,
      houseNo: 'H-310',
      wardNo: '3',
      address: 'Temple Street, Ward 3, Londhave',
      preferredLang: 'mr',
    }
  });

  // 3. Panchayat Members
  await prisma.panchayatMember.createMany({
    data: [
      {
        name: 'सौ. संगीता सुभाष पाटील',
        designationEn: 'Sarpanch',
        designationMr: 'सरपंच',
        designationHi: 'सरपंच',
        contact: '9422200001',
        wardNo: 'Ward 1',
        orderIndex: 1,
        roleDescriptionEn: 'Head of Gram Panchayat, leading rural development and public welfare.',
        roleDescriptionMr: 'ग्रामपंचायतीच्या प्रमुख, गाव विकास व लोककल्याणकारी योजनांच्या प्रमुख मार्गदर्शक.',
        roleDescriptionHi: 'ग्राम पंचायत की प्रमुख, ग्रामीण विकास और जन कल्याण का नेतृत्व।',
      },
      {
        name: 'श्री. रवींद्र उत्तम पाटील',
        designationEn: 'Up-Sarpanch',
        designationMr: 'उपसरपंच',
        designationHi: 'उपसरपंच',
        contact: '9422200005',
        wardNo: 'Ward 2',
        orderIndex: 2,
        roleDescriptionEn: 'Deputy Sarpanch overseeing water supply & infrastructure projects.',
        roleDescriptionMr: 'उपसरपंच, पाणीपुरवठा व मूलभूत पायाभूत सुविधांचे प्रमुख निरीक्षक.',
        roleDescriptionHi: 'उपसरपंच, जल आपूर्ति और बुनियादी ढांचा परियोजनाओं के निरीक्षक।',
      },
      {
        name: 'श्री. ए. बी. चव्हाण',
        designationEn: 'Gramsevak / Village Development Officer',
        designationMr: 'ग्रामसेवक / ग्राम विकास अधिकारी',
        designationHi: 'ग्रामसेवक / ग्राम विकास अधिकारी',
        contact: '9422200002',
        orderIndex: 3,
        roleDescriptionEn: 'Chief Executive Officer of GP, executing government schemes & administrative decisions.',
        roleDescriptionMr: 'ग्रामपंचायतीचे मुख्य प्रशासकीय अधिकारी, सरकारी योजनांची अंमलबजावणीकर्ते.',
        roleDescriptionHi: 'ग्राम पंचायत के मुख्य कार्यकारी अधिकारी, सरकारी योजनाओं का निष्पादन।',
        isStaff: true,
      },
      {
        name: 'सौ. रेखा विलास चौधरी',
        designationEn: 'Gram Panchayat Member',
        designationMr: 'ग्रामपंचायत सदस्य',
        designationHi: 'ग्राम पंचायत सदस्य',
        contact: '9422200006',
        wardNo: 'Ward 3',
        orderIndex: 4,
        roleDescriptionEn: 'Representative Ward 3, focus on Women & Child Development.',
        roleDescriptionMr: 'प्रभाग ३ प्रतिनिधी, महिला व बालविकास समिती सदस्य.',
        roleDescriptionHi: 'वार्ड 3 प्रतिनिधि, महिला एवं बाल विकास पर ध्यान।',
      },
      {
        name: 'श्री. ज्ञानेश्वर तुकाराम शinde',
        designationEn: 'Gram Panchayat Member',
        designationMr: 'ग्रामपंचायत सदस्य',
        designationHi: 'ग्राम पंचायत सदस्य',
        contact: '9422200007',
        wardNo: 'Ward 4',
        orderIndex: 5,
        roleDescriptionEn: 'Representative Ward 4, focus on Youth & Sports.',
        roleDescriptionMr: 'प्रभाग ४ प्रतिनिधी, युवक व क्रीडा विकास समिती सदस्य.',
        roleDescriptionHi: 'वार्ड 4 प्रतिनिधि, युवा और खेल समिति।',
      }
    ]
  });

  // 4. Village Facilities
  await prisma.villageFacility.createMany({
    data: [
      {
        category: 'SCHOOL',
        nameEn: 'Zilla Parishad Primary School Londhave',
        nameMr: 'जिल्हा परिषद प्राथमिक शाळा लोंढवे',
        nameHi: 'जिला परिषद प्राथमिक विद्यालय लोंढवे',
        descEn: 'Co-educational primary school offering Classes 1st to 7th with computer lab and digital classroom.',
        descMr: 'इयत्ता १ ली ते ७ वी पर्यंतचे डिजिटल वर्गासह गुणवत्तापूर्ण शिक्षण देणारी शाळा.',
        descHi: 'कंप्यूटर लैब और डिजिटल कक्षा के साथ कक्षा 1 से 7 तक की प्राथमिक शिक्षा।',
        phone: '02587-240101',
        orderIndex: 1
      },
      {
        category: 'HEALTH',
        nameEn: 'Primary Health Sub-Centre Londhave',
        nameMr: 'प्राथमिक आरोग्य उपकेंद्र लोंढवे',
        nameHi: 'प्राथमिक स्वास्थ्य उपकेंद्र लोंढवे',
        descEn: '24x7 Emergency first aid, maternal care, vaccination, and free government medicine distribution.',
        descMr: '२४x७ प्रथमोपचार, माता व बालसंगोपन, लसीकरण व मोफत औषध वाटप केंद्र.',
        descHi: '24x7 आपातकालीन प्राथमिक चिकित्सा, मातृ देखभाल और नि:शुल्क दवा वितरण।',
        phone: '02587-240102',
        orderIndex: 2
      },
      {
        category: 'BANK',
        nameEn: 'Bank of Maharashtra - Londhave Branch & Customer Service Point',
        nameMr: 'बँक ऑफ महाराष्ट्र - लोंढवे ग्राहक सेवा केंद्र (CSP)',
        nameHi: 'बैंक ऑफ महाराष्ट्र - लोंढवे ग्राहक सेवा केंद्र',
        descEn: 'Direct Benefit Transfer (DBT), pension, savings accounts, AEPS micro-ATM operations.',
        descMr: 'सरकारी योजनांचे डिबीटी पैसे जमा करणे, आधार निगडित रोख रक्कम देणे व खाते उघडणे.',
        descHi: 'सरकारी योजनाओं का भुगतान, बचत खाते और एईपीएस माइक्रो-एटीएम सुविधाएं।',
        phone: '02587-240103',
        orderIndex: 3
      },
      {
        category: 'TEMPLE',
        nameEn: 'Shri Maruti & Hanuman Temple',
        nameMr: 'श्री मारुती व हनुमान मंदिर लोंढवे',
        nameHi: 'श्री मारुति एवं हनुमान मंदिर',
        descEn: 'Historic village temple and center for annual Hanuman Jayanti festival and community gatherings.',
        descMr: 'गावातील ऐतिहासिक श्रद्धास्थान, वार्षिक हनुमान जयंती उत्सव व सामुदायिक केंद्र.',
        descHi: 'ऐतिहासिक मंदिर और वार्षिक हनुमान जयंती उत्सव का मुख्य केंद्र।',
        orderIndex: 4
      },
      {
        category: 'ANGANWADI',
        nameEn: 'Anganwadi Centre No. 1',
        nameMr: 'अंगणवाडी केंद्र क्र. १',
        nameHi: 'आंगनवाड़ी केंद्र संख्या 1',
        descEn: 'Pre-school education, supplementary nutrition distribution, and child health tracking.',
        descMr: 'पूर्व-प्राथमिक शिक्षण, पोषण आहार वाटप व कुपोषण निर्मूलन केंद्र.',
        descHi: 'पूर्व-प्राथमिक शिक्षा, पूरक पोषण आहार वितरण केंद्र।',
        orderIndex: 5
      }
    ]
  });

  // 5. Village Stats (Official Government Census 2011 & 2026 GP Records for Londhave)
  await prisma.villageStat.createMany({
    data: [
      { key: 'total_population', labelEn: 'Total Population (Census 2011)', labelMr: 'एकूण लोकसंख्या (जनगणना २०११)', labelHi: 'कुल जनसंख्या (जनगणना 2011)', value: '2,628', category: 'DEMOGRAPHICS', icon: 'Users' },
      { key: 'households', labelEn: 'Total Households (Census 2011)', labelMr: 'एकूण कुटुंबे (जनगणना २०११)', labelHi: 'कुल परिवार (जनगणना 2011)', value: '513', category: 'DEMOGRAPHICS', icon: 'Home' },
      { key: 'water_connections', labelEn: 'Tap Water Connections (Har Ghar Jal)', labelMr: 'नल जोडणी (हर घर जल)', labelHi: 'नल जल कनेक्शन', value: '490', category: 'INFRASTRUCTURE', icon: 'Droplets' },
      { key: 'solar_streetlights', labelEn: 'Solar Street Lights', labelMr: 'सौर पथदिवे', labelHi: 'सौर स्ट्रीट लाइट', value: '145', category: 'INFRASTRUCTURE', icon: 'Sun' },
      { key: 'school_enrollment', labelEn: 'Primary School Students', labelMr: 'शालेय विद्यार्थी', labelHi: 'प्राथमिक विद्यालय छात्र', value: '285', category: 'SERVICES', icon: 'GraduationCap' },
      { key: 'scheme_beneficiaries', labelEn: 'Scheme Beneficiaries', labelMr: 'सरकारी योजना लाभार्थी', labelHi: 'सरकारी योजना लाभार्थी', value: '740', category: 'SCHEMES', icon: 'Award' }
    ]
  });

  // 6. Content Items (Notices, News, Schemes, Events, Documents)

  // NOTICE 1: Gram Sabha
  const notice1 = await prisma.contentItem.create({
    data: {
      type: ContentType.NOTICE,
      status: ContentStatus.PUBLISHED,
      category: 'Gram Sabha',
      isPinned: true,
      authorId: sarpanchUser.id,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Notice: Special Independence Day Gram Sabha Meeting on 15th August 2026',
            subtitle: 'Venue: Gram Panchayat Hall | Time: 10:00 AM',
            body: 'All residents of Londhave village are hereby invited to attend the Special Gram Sabha on Independence Day. Key agenda: 1) Approval of Village Development Plan 2026-27, 2) Jal Jeevan Mission progress report, 3) Selection of PMAY beneficiaries, 4) Sanitation drive planning.',
            metadata: { venue: 'Gram Panchayat Hall', meetingDate: '2026-08-15 10:00 AM' }
          },
          {
            lang: 'mr',
            title: 'सूचना: स्वातंत्र्य दिन विशेष ग्रामसभा बैठक १५ ऑगस्ट २०२६ रोजी आयोजित',
            subtitle: 'स्थळ: ग्रामपंचायत सभागृह | वेळ: सकाळी १०:०० वाजता',
            body: 'लोंढवे गावातील सर्व ग्रामस्थांना कळविण्यात येते की १५ ऑगस्ट रोजी स्वातंत्र्य दिनानिमित्त विशेष ग्रामसभेचे आयोजन करण्यात आले आहे. सभेचे मुख्य विषय: १) गाव विकास आराखडा २०२६-२७ मंजुरी, २) हर घर जल मिशन प्रगती अहवाल, ३) घरकुल लाभार्थी निवड, ४) स्वच्छता मोहीम नियोजन.',
            metadata: { venue: 'ग्रामपंचायत सभागृह', meetingDate: '१५ ऑगस्ट २०२६, सकाळी १०:००' }
          },
          {
            lang: 'hi',
            title: 'सूचना: 15 अगस्त 2026 को स्वतंत्रता दिवस विशेष ग्राम सभा की बैठक',
            subtitle: 'स्थान: ग्राम पंचायत भवन | समय: सुबह 10:00 बजे',
            body: 'लोंढवे गांव के सभी नागरिकों को सूचित किया जाता है कि स्वतंत्रता दिवस के अवसर पर विशेष ग्राम सभा का आयोजन किया गया है। मुख्य एजेंडा: 1) गांव विकास योजना 2026-27 स्वीकृति, 2) जल जीवन मिशन प्रगति रिपोर्ट, 3) आवास योजना लाभार्थी चयन।',
            metadata: { venue: 'ग्राम पंचायत भवन', meetingDate: '15 अगस्त 2026, सुबह 10:00 बजे' }
          }
        ]
      }
    }
  });

  // NOTICE 2: Water Pipeline Maintenance
  await prisma.contentItem.create({
    data: {
      type: ContentType.NOTICE,
      status: ContentStatus.PUBLISHED,
      category: 'Utility Service',
      isPinned: false,
      authorId: staffWater.id,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Water Supply Interruption Notice - Thursday Maintenance Work',
            subtitle: 'Affected Areas: Ward 2 & Ward 3',
            body: 'Due to main pipeline valve repair work near ZP School, morning water supply will remain suspended on Thursday between 8:00 AM and 1:00 PM. Residents are requested to store adequate water.',
          },
          {
            lang: 'mr',
            title: 'पाणीपुरवठा खंडित राहण्याची सूचना - गुरुवार देखभाल दुरुस्ती काम',
            subtitle: 'प्रभावित क्षेत्र: प्रभाग क्र. २ व प्रभाग क्र. ३',
            body: 'मुख्य जलवाहिनीच्या व्हाल्व्ह दुरुस्तीच्या कामामुळे गुरुवारी सकाळी ८:०० ते दुपारी १:०० या वेळेत प्रभाग २ व ३ मधील पाणीपुरवठा बंद राहील. ग्रामस्थांनी आवश्यक पाणी साठवून ठेवावे.',
          },
          {
            lang: 'hi',
            title: 'जल आपूर्ति बाधित रहने की सूचना - गुरुवार मरम्मत कार्य',
            subtitle: 'प्रभावित क्षेत्र: वार्ड 2 और वार्ड 3',
            body: 'मुख्य पाइपलाइन मरम्मत के कारण गुरुवार सुबह 8:00 से दोपहर 1:00 बजे तक जल आपूर्ति बाधित रहेगी। कृपया पर्याप्त पानी जमा कर लें।',
          }
        ]
      }
    }
  });

  // NEWS 1: Smart Village Award
  await prisma.contentItem.create({
    data: {
      type: ContentType.NEWS,
      status: ContentStatus.PUBLISHED,
      category: 'Village Achievements',
      isPinned: true,
      authorId: sarpanchUser.id,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Londhave Gram Panchayat Honored with Smart Village Award in Amalner Taluka',
            subtitle: 'Recognized for 100% Digital Tax Payment and Solar Energy Infrastructure',
            body: 'Londhave village has secured 1st position in Amalner Taluka under the Smart Gram Yojana. The district collector praised the village for installing solar streetlights and launching digital citizen services.',
          },
          {
            lang: 'mr',
            title: 'लोंढवे ग्रामपंचायतीला अमळनेर तालुक्यात "स्मार्ट व्हिलेज" पुरस्कार सन्मान',
            subtitle: 'डिजिटल सेवा व १००% सौर ऊर्जेच्या प्रभावी वापरासाठी प्रथम क्रमांक',
            body: 'स्मार्ट ग्राम योजनेअंतर्गत लोंढवे गावाने अमळनेर तालुक्यात प्रथम क्रमांक पटकावला आहे. जलद डिजिटल तक्रार निवारण आणि संपूर्ण गावात सौर पथदिवे बसवल्याबद्दल जिल्हाधिकाऱ्यांच्या हस्ते सत्कार करण्यात आला.',
          },
          {
            lang: 'hi',
            title: 'लोंढवे ग्राम पंचायत को अमळनेर तालुका में "स्मार्ट विलेज" पुरस्कार',
            subtitle: 'डिजिटल सेवाओं और सौर ऊर्जा अवसंरचना के लिए प्रथम पुरस्कार',
            body: 'स्मार्ट ग्राम योजना के तहत लोंढवे गांव ने अमळनेर तालुका में पहला स्थान प्राप्त किया है।',
          }
        ]
      }
    }
  });

  // SCHEME 1: PM Kisan
  await prisma.contentItem.create({
    data: {
      type: ContentType.SCHEME,
      status: ContentStatus.PUBLISHED,
      category: 'Agriculture',
      isPinned: true,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'PM-Kisan Samman Nidhi Yojana (Rs 6,000 / year)',
            subtitle: 'Direct financial assistance of ₹6,000 annually in 3 installments to small and marginal farmers.',
            body: 'Under PM-Kisan Yojana, eligible farmer families receive ₹2,000 every 4 months directly into their Aadhaar-linked bank accounts.',
            metadata: { eligibility: 'Landholding farmer family with updated e-KYC and 7/12 extract.', docs: '7/12 & 8A extract, Aadhaar card, Bank passbook copy, Aadhaar-linked mobile.' }
          },
          {
            lang: 'mr',
            title: 'पीएम-किसान सन्मान निधी योजना (वार्षिक रु. ६,००० सहाय्य)',
            subtitle: 'शेतकऱ्यांना वर्षाला ₹६,००० चे थेट आर्थिक सहाय्य ३ हप्त्यांमध्ये सानुग्रह अनुदान.',
            body: 'या योजनेंतर्गत पात्र शेतकरी कुटुंबांना दर ४ महिन्यांनी ₹२,००० थेट त्यांच्या बँक खात्यात डिबीटीद्वारे जमा केले जातात.',
            metadata: { eligibility: '७/१२ व ८-अ उतारा असलेले शेतकरी कुटुंब, ई-केवायसी पूर्ण.', docs: '७/१२ उतारा, ८-अ दाखला, आधार कार्ड, बँक पासबूक प्रत, मोबाईल नंबर.' }
          },
          {
            lang: 'hi',
            title: 'पीएम-किसान सम्मान निधि योजना (रु. 6,000/वर्ष)',
            subtitle: 'किसानों को प्रति वर्ष ₹6,000 की प्रत्यक्ष वित्तीय सहायता।',
            body: 'इस योजना के तहत पात्र किसान परिवारों को हर 4 महीने में ₹2,000 सीधे उनके बैंक खाते में ट्रांसफर किए जाते हैं।',
            metadata: { eligibility: 'भूमिधारक किसान परिवार जिनका ई-केवाईसी पूर्ण है।', docs: '7/12 नकल, आधार कार्ड, बैंक पासबुक।' }
          }
        ]
      }
    }
  });

  // SCHEME 2: PMAY-G
  await prisma.contentItem.create({
    data: {
      type: ContentType.SCHEME,
      status: ContentStatus.PUBLISHED,
      category: 'PMAY Housing',
      isPinned: false,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
            subtitle: 'Financial assistance of ₹1.20 Lakh for constructing permanent pucca house for kutcha house dwellers.',
            body: 'Provides financial subsidy for construction of safe, dignified home along with 90 days MGNREGA employment wages and toilet construction assistance.',
            metadata: { eligibility: 'Homeless families or households living in kutcha houses listed in SECC data.', docs: 'Aadhaar, SECC Certificate, Bank Passbook, Job Card, Land document.' }
          },
          {
            lang: 'mr',
            title: 'प्रधानमंत्री आवास योजना - ग्रामीण (घरकुल योजना)',
            subtitle: 'पक्के घर बांधण्यासाठी ₹१,२०,००० थेट बँक खात्यावर अनुदान.',
            body: 'कच्च्या घरात राहणाऱ्या किंवा बेघर कुटुंबांना पक्के घर बांधण्यासाठी निधी आणि मनरेगा मजुरी दिली जाते.',
            metadata: { eligibility: 'एसईसीसी यादीत समाविष्ट बेघर किंवा कच्च्या घरातील कुटुंबे.', docs: 'आधार कार्ड, बँक पासबुक, रोजगार कार्ड, जागेचा पुरावा.' }
          },
          {
            lang: 'hi',
            title: 'प्रधानमंत्री आवास योजना - ग्रामीण (पीएमएवाई-जी)',
            subtitle: 'पक्का मकान बनाने के लिए ₹1,20,000 की सहायता राशि।',
            body: 'कच्चे घरों में रहने वाले परिवारों को पक्का मकान बनाने के लिए वित्तीय सहायता प्रदान की जाती है।',
            metadata: { eligibility: 'बेघर परिवार या कच्चे घर में रहने वाले परिवार।', docs: 'आधार कार्ड, बैंक पासबुक, भूमि दस्तावेज।' }
          }
        ]
      }
    }
  });

  // EVENT 1: Tree Plantation
  await prisma.contentItem.create({
    data: {
      type: ContentType.EVENT,
      status: ContentStatus.PUBLISHED,
      category: 'Environment',
      isPinned: false,
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Mega Tree Plantation Drive - 500 Saplings in Village Outskirts',
            subtitle: 'Date: Sunday, 24th August 2026 | Time: 7:00 AM',
            body: 'Join us in making Londhave green! Fruit-bearing and shade trees will be planted along the main village approach road and near school grounds. Free saplings will be provided.',
            metadata: { date: '2026-08-24', time: '07:00 AM', location: 'ZP School Grounds & Approach Road' }
          },
          {
            lang: 'mr',
            title: 'भव्य वृक्षारोपण मोहीम - लोंढवे शिवारात ५०० झाडांची लागवड',
            subtitle: 'दिनांक: रविवार २४ ऑगस्ट २०२६ | वेळ: सकाळी ७:०० वाजता',
            body: 'गावाला हरित व सुंदर बनवण्यासाठी सर्व युवकांनी व ग्रामस्थांनी सहभागी व्हावे. फळझाडे व सावली देणाऱ्या रोपांचे वाटप मोफत केले जाईल.',
            metadata: { date: '२४ ऑगस्ट २०२६', time: 'सकाळी ०७:००', location: 'जि. प. शाळा मैदान व मुख्य रस्ता' }
          },
          {
            lang: 'hi',
            title: 'वृक्षारोपण अभियान - 500 पौधे लगाने का लक्ष्य',
            subtitle: 'दिनांक: रविवार 24 अगस्त 2026 | समय: सुबह 7:00 बजे',
            body: 'गांव को हरा-भरा बनाने के लिए वृक्षारोपण अभियान में भाग लें।',
            metadata: { date: '24 अगस्त 2026', time: 'सुबह 07:00', location: 'स्कूल परिसर' }
          }
        ]
      }
    }
  });

  // DOCUMENT 1: Certificate Form
  await prisma.contentItem.create({
    data: {
      type: ContentType.DOCUMENT,
      status: ContentStatus.PUBLISHED,
      category: 'Application Forms',
      isPinned: false,
      docUrl: '/documents/londhave_cert_form.pdf',
      translations: {
        create: [
          {
            lang: 'en',
            title: 'Gram Panchayat Universal Certificate Application Form PDF',
            subtitle: 'Downloadable application format for Birth, Residence, No-Dues & Property tax clearance certificates.',
            body: 'Official single-window physical application form for submitting at the GP office counter.',
          },
          {
            lang: 'mr',
            title: 'सर्वसाधारण प्रमाणपत्र मागणी अर्ज नमुना (PDF)',
            subtitle: 'जन्म, रहिवासी, थकबाकी नसल्याचा दाखला यासाठी लागणारा अधिकृत अर्ज.',
            body: 'ग्रामपंचायत कार्यालयात सादर करावयाचा अधिकृत छापील अर्ज नमुना.',
          },
          {
            lang: 'hi',
            title: 'ग्राम पंचायत प्रमाण पत्र आवेदन पत्र पीडीएफ',
            subtitle: 'जन्म, निवास और अनापत्ति प्रमाण पत्र के लिए आवेदन पत्र।',
            body: 'कार्यालय में जमा करने हेतु आधिकारिक आवेदन फॉर्म।',
          }
        ]
      }
    }
  });

  // 7. Complaints
  const cmp1 = await prisma.complaint.create({
    data: {
      ticketNo: 'LND-CMP-2026-001',
      citizenId: citizenRamesh.id,
      citizenName: citizenRamesh.name,
      citizenMobile: citizenRamesh.mobile!,
      category: ComplaintCategory.STREETLIGHT,
      priority: ComplaintPriority.HIGH,
      status: ComplaintStatus.IN_PROGRESS,
      title: 'Solar Streetlight not working near Ward 1 temple corner',
      description: 'The solar streetlight panel battery is damaged and light stays dim/off after 8 PM causing dark spots.',
      location: 'Ward 1, Near Maruti Temple Corner',
      wardNo: '1',
      assignedToId: staffSanitation.id,
      history: {
        create: [
          { oldStatus: ComplaintStatus.PENDING, newStatus: ComplaintStatus.IN_PROGRESS, actorName: 'Gramsevak A.B. Chavan', remarks: 'Assigned to maintenance technician for battery replacement.' }
        ]
      }
    }
  });

  await prisma.complaint.create({
    data: {
      ticketNo: 'LND-CMP-2026-002',
      citizenId: citizenSunita.id,
      citizenName: citizenSunita.name,
      citizenMobile: citizenSunita.mobile!,
      category: ComplaintCategory.WATER,
      priority: ComplaintPriority.URGENT,
      status: ComplaintStatus.PENDING,
      title: 'Low water pressure in Ward 2 tap line',
      description: 'Water pressure has significantly reduced since Monday, taking over 2 hours to fill basic domestic buckets.',
      location: 'Ward 2, House No 205 Lane',
      wardNo: '2',
    }
  });

  await prisma.complaint.create({
    data: {
      ticketNo: 'LND-CMP-2026-003',
      citizenId: citizenPrakash.id,
      citizenName: citizenPrakash.name,
      citizenMobile: citizenPrakash.mobile!,
      category: ComplaintCategory.DRAINAGE,
      priority: ComplaintPriority.MEDIUM,
      status: ComplaintStatus.RESOLVED,
      title: 'Open drainage overflow cleared near main Bazaar road',
      description: 'Drainage line was blocked due to plastic waste accumulating after heavy rainfall.',
      location: 'Ward 3, Main Bazaar Road',
      wardNo: '3',
      assignedToId: staffWater.id,
      resolutionRemarks: 'Silt and waste successfully cleared using suction equipment on Tuesday.',
      history: {
        create: [
          { oldStatus: ComplaintStatus.PENDING, newStatus: ComplaintStatus.IN_PROGRESS, actorName: 'Gramsevak A.B. Chavan', remarks: 'Cleaning crew dispatched.' },
          { oldStatus: ComplaintStatus.IN_PROGRESS, newStatus: ComplaintStatus.RESOLVED, actorName: 'Vikas Patil', remarks: 'Drainage blockage cleared and disinfected with bleaching powder.' }
        ]
      }
    }
  });

  // 8. Tax Bills
  const bill1 = await prisma.taxBill.create({
    data: {
      billNo: 'LND-TAX-2026-001',
      citizenId: citizenRamesh.id,
      citizenName: citizenRamesh.name,
      propertyNo: 'PROP-102',
      houseNo: 'H-102',
      wardNo: '1',
      taxType: TaxType.PROPERTY_HOUSE,
      amount: 1450.00,
      assessmentYear: '2025-2026',
      dueDate: new Date('2026-09-30'),
      status: TaxStatus.UNPAID,
    }
  });

  const bill2 = await prisma.taxBill.create({
    data: {
      billNo: 'LND-TAX-2026-002',
      citizenId: citizenRamesh.id,
      citizenName: citizenRamesh.name,
      propertyNo: 'PROP-102',
      houseNo: 'H-102',
      wardNo: '1',
      taxType: TaxType.WATER,
      amount: 600.00,
      assessmentYear: '2025-2026',
      dueDate: new Date('2026-09-30'),
      status: TaxStatus.PAID,
    }
  });

  await prisma.payment.create({
    data: {
      transactionId: 'TXN-20260801-99881',
      billId: bill2.id,
      citizenId: citizenRamesh.id,
      citizenName: citizenRamesh.name,
      amount: 600.00,
      paymentMethod: 'UPI',
      status: 'SUCCESS',
      receiptNo: 'LND-REC-2026-8801',
      paidAt: new Date('2026-08-01'),
    }
  });

  await prisma.taxBill.create({
    data: {
      billNo: 'LND-TAX-2026-003',
      citizenId: citizenSunita.id,
      citizenName: citizenSunita.name,
      propertyNo: 'PROP-205',
      houseNo: 'H-205',
      wardNo: '2',
      taxType: TaxType.PROPERTY_HOUSE,
      amount: 1200.00,
      assessmentYear: '2025-2026',
      dueDate: new Date('2026-09-30'),
      status: TaxStatus.UNPAID,
    }
  });

  // 9. Certificates Applications
  await prisma.certificateApp.create({
    data: {
      applicationNo: 'LND-CERT-2026-001',
      citizenId: citizenRamesh.id,
      citizenName: citizenRamesh.name,
      citizenMobile: citizenRamesh.mobile!,
      certType: CertType.RESIDENCE,
      status: CertStatus.APPROVED,
      applicantDetails: { fatherName: 'आनंद पाटील', reason: 'Bank Loan Application', dob: '1988-04-12', address: 'Ward 1, Londhave' },
      docUrls: ['/uploads/aadhaar_ramesh.pdf', '/uploads/tax_receipt_2025.pdf'],
      issuedCertUrl: '/certificates/issued_residence_ramesh.pdf',
      adminRemarks: 'Verified against GP residency register and tax records.',
    }
  });

  await prisma.certificateApp.create({
    data: {
      applicationNo: 'LND-CERT-2026-002',
      citizenId: citizenSunita.id,
      citizenName: citizenSunita.name,
      citizenMobile: citizenSunita.mobile!,
      certType: CertType.NO_DUES,
      status: CertStatus.UNDER_REVIEW,
      applicantDetails: { fatherName: 'एकनाथ शिंदे', reason: 'Electricity Meter Transfer', address: 'Ward 2, Londhave' },
      docUrls: ['/uploads/sunita_aadhaar.pdf'],
      adminRemarks: 'Pending property tax verification.',
    }
  });

  // 10. Utility Schedules
  await prisma.utilitySchedule.createMany({
    data: [
      { type: ScheduleType.WATER_SUPPLY, area: 'Ward 1 & Ward 2 (Main Village & School area)', timing: 'Morning 06:00 AM - 07:30 AM', status: 'ACTIVE', scheduleDate: 'Daily' },
      { type: ScheduleType.WATER_SUPPLY, area: 'Ward 3 & Ward 4 (Bazaar Road & Temple Lane)', timing: 'Evening 05:00 PM - 06:30 PM', status: 'ACTIVE', scheduleDate: 'Daily' },
      { type: ScheduleType.GARBAGE_COLLECTION, area: 'Door-to-door collection all wards', timing: 'Morning 08:00 AM - 10:30 AM', status: 'ACTIVE', scheduleDate: 'Daily Except Sunday' },
      { type: ScheduleType.ELECTRICITY_OUTAGE, area: 'Whole Village (Feeder Maintenance by MSEDCL)', timing: '10:00 AM - 01:00 PM', status: 'SCHEDULED', remarks: 'MSEDCL scheduled line clearance work on Thursday', scheduleDate: 'Thursday' }
    ]
  });

  // 11. Survey / Poll
  const poll = await prisma.surveyPoll.create({
    data: {
      titleEn: 'Citizen Feedback Poll: Where should new solar streetlights be installed first?',
      titleMr: 'नागरिक कौल: गावातील नवीन सौर पथदिवे प्राधान्याने कोठे बसवावेत?',
      titleHi: 'नागरिक पोल: नई सौर स्ट्रीट लाइटें प्राथमिकता से कहां लगाई जानी चाहिए?',
      descEn: 'Please vote your preference to help GP prioritize ward lighting budget.',
      descMr: 'ग्रामपंचायतीला निधीचे नियोजन करण्यास मदत करण्यासाठी आपले मत नोंदवा.',
      descHi: 'कृपया अपनी प्राथमिकता के लिए वोट करें।',
      type: 'POLL',
      isActive: true,
      options: {
        create: [
          { textEn: 'Main Village Entrance & Approach Road', textMr: 'मुख्य गाव प्रवेशद्वार व मुख्य रस्ता', textHi: 'मुख्य गांव प्रवेश द्वार', voteCount: 42 },
          { textEn: 'ZP School & Anganwadi Area', textMr: 'जि. प. शाळा व अंगणवाडी परिसर', textHi: 'स्कूल एवं आंगनवाड़ी परिसर', voteCount: 68 },
          { textEn: 'Temple Square & Bazaar Road', textMr: 'मंदिर चौक व बाजार गल्ली', textHi: 'मंदिर चौक एवं बाजार गली', voteCount: 35 },
          { textEn: 'Ward 4 Residential Lanes', textMr: 'प्रभाग ४ मधील अंतर्गत गल्ली', textHi: 'वार्ड 4 की गलियां', voteCount: 19 }
        ]
      }
    }
  });

  // 12. Audit Log & Notifications
  await prisma.notification.create({
    data: {
      channel: 'SMS',
      audience: 'ALL',
      title: 'Gram Sabha Reminder',
      message: 'Reminder: Independence Day Special Gram Sabha on 15th Aug at 10 AM at GP Hall. All residents welcome.',
      status: 'SENT',
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: sarpanchUser.id,
      actorName: sarpanchUser.name,
      actorRole: sarpanchUser.role,
      action: 'CREATE_NOTICE',
      entity: 'ContentItem',
      entityId: notice1.id,
      details: { title: 'Independence Day Gram Sabha Notice' },
      ipAddress: '127.0.0.1'
    }
  });

  console.log('✅ Seed data successfully created!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
