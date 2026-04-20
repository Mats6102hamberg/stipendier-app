/**
 * seedUKStipendier.ts
 * Seeds 87 realistic UK scholarships into the database.
 *
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seedUKStipendier.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const ukStipendier = [
  // ── Health & Medicine (15) ────────────────────────────────────────────────

  {
    namn: "Wellcome Trust Senior Research Fellowship in Clinical Science",
    organisation: "Wellcome Trust",
    beskrivning:
      "Supports outstanding clinician-scientists to develop independent research programmes in any area of human health. Fellows receive salary, research costs and training support for up to five years.",
    belopp: 250000,
    beloppMax: 400000,
    deadline: new Date("2026-09-01"),
    kategorier: ["Health & medicine", "Research", "Clinical science", "Cancer research"],
    målgrupp: ["Clinician-scientists", "Researchers", "Postdoctoral researchers"],
    url: "https://wellcome.org/grant-funding/schemes/senior-research-fellowships",
    land: "GB",
  },
  {
    namn: "Cancer Research UK Pioneer Award",
    organisation: "Cancer Research UK",
    beskrivning:
      "Funds bold, unconventional ideas that challenge existing paradigms in cancer biology and treatment. Awards support early-stage exploratory projects that would be difficult to fund through conventional routes.",
    belopp: 200000,
    beloppMax: 500000,
    deadline: new Date("2026-07-15"),
    kategorier: ["Health & medicine", "Cancer research", "Oncology", "Research"],
    målgrupp: ["Cancer researchers", "Scientists", "Academics"],
    url: "https://www.cancerresearchuk.org/funding-for-researchers/our-funding-schemes/pioneer-award",
    land: "GB",
  },
  {
    namn: "British Heart Foundation Intermediate Basic Science Research Fellowship",
    organisation: "British Heart Foundation",
    beskrivning:
      "Enables promising early-career basic scientists to establish independent research programmes in cardiovascular science. The fellowship covers salary and research expenses for four years.",
    belopp: 180000,
    beloppMax: 280000,
    deadline: new Date("2026-10-01"),
    kategorier: ["Health & medicine", "Cardiology", "Cardiovascular research", "Research"],
    målgrupp: ["Early-career researchers", "Scientists", "Postdoctoral researchers"],
    url: "https://www.bhf.org.uk/for-professionals/information-for-researchers/what-we-fund/fellowships",
    land: "GB",
  },
  {
    namn: "Medical Research Council Career Development Award",
    organisation: "Medical Research Council",
    beskrivning:
      "Provides support for post-doctoral researchers with outstanding potential to develop their careers as independent researchers in areas of strategic importance to MRC. Awards run for four years.",
    belopp: 200000,
    beloppMax: 350000,
    deadline: new Date("2026-11-15"),
    kategorier: ["Health & medicine", "Research", "Biomedical science", "Public health"],
    målgrupp: ["Postdoctoral researchers", "Early-career scientists", "Academics"],
    url: "https://www.ukri.org/opportunity/mrc-career-development-award/",
    land: "GB",
  },
  {
    namn: "Wellcome Trust Mental Health Award",
    organisation: "Wellcome Trust",
    beskrivning:
      "Supports research that addresses major gaps in understanding, preventing or treating mental health conditions, with a focus on depression and anxiety in young people. Grants cover research costs and salary.",
    belopp: 300000,
    beloppMax: 800000,
    deadline: new Date("2026-06-30"),
    kategorier: ["Health & medicine", "Psychiatry", "Mental health", "Research"],
    målgrupp: ["Researchers", "Clinicians", "Early-career scientists"],
    url: "https://wellcome.org/grant-funding/schemes/mental-health-award",
    land: "GB",
  },
  {
    namn: "Queen's Nursing Institute Research Scholarship",
    organisation: "Queen's Nursing Institute",
    beskrivning:
      "Supports practising nurses, midwives and health visitors to undertake research that improves community-based nursing care. Awards fund study leave, project costs and dissemination activities.",
    belopp: 10000,
    beloppMax: 25000,
    deadline: new Date("2026-05-31"),
    kategorier: ["Health & medicine", "Nursing", "Community health", "Research"],
    målgrupp: ["Nurses", "Midwives", "Health visitors"],
    url: "https://www.qni.org.uk/nursing-in-the-community/grants-and-scholarships/",
    land: "GB",
  },
  {
    namn: "Cancer Research UK Predoctoral Fellowship",
    organisation: "Cancer Research UK",
    beskrivning:
      "Funds exceptional graduates to undertake a PhD in cancer research at a leading UK institution, covering tuition fees, a stipend and research costs for three to four years.",
    belopp: 20000,
    beloppMax: 25000,
    deadline: new Date("2026-08-31"),
    kategorier: ["Health & medicine", "Cancer research", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Graduates", "Early-career researchers"],
    url: "https://www.cancerresearchuk.org/funding-for-researchers/our-funding-schemes/predoctoral-fellowship",
    land: "GB",
  },
  {
    namn: "British Heart Foundation PhD Studentship",
    organisation: "British Heart Foundation",
    beskrivning:
      "Offers fully funded PhD studentships for exceptional graduates to pursue cardiovascular research under the supervision of established BHF-funded researchers. Covers fees, stipend and project costs.",
    belopp: 22000,
    deadline: new Date("2026-12-01"),
    kategorier: ["Health & medicine", "Cardiology", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Graduates", "Aspiring researchers"],
    url: "https://www.bhf.org.uk/for-professionals/information-for-researchers/what-we-fund/studentships",
    land: "GB",
  },
  {
    namn: "MRC Doctoral Training Partnership Studentship",
    organisation: "Medical Research Council",
    beskrivning:
      "Provides competitive PhD studentships hosted at MRC Doctoral Training Partnerships across the UK, covering a broad range of biomedical and health sciences disciplines.",
    belopp: 21000,
    deadline: new Date("2026-07-01"),
    kategorier: ["Health & medicine", "Biomedical science", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Graduates", "Biomedical scientists"],
    url: "https://www.ukri.org/opportunity/mrc-doctoral-training-partnerships/",
    land: "GB",
  },
  {
    namn: "Wellcome Trust Public Engagement Award",
    organisation: "Wellcome Trust",
    beskrivning:
      "Enables researchers and cultural organisations to develop creative public engagement projects exploring health and medicine topics. Projects should inspire curiosity and dialogue about biomedical research.",
    belopp: 50000,
    beloppMax: 150000,
    deadline: new Date("2027-01-15"),
    kategorier: ["Health & medicine", "Public health", "Science communication", "Engagement"],
    målgrupp: ["Researchers", "Cultural organisations", "Science communicators"],
    url: "https://wellcome.org/grant-funding/schemes/public-engagement-fund",
    land: "GB",
  },
  {
    namn: "NIHR Global Health Research Award",
    organisation: "Medical Research Council",
    beskrivning:
      "Supports research partnerships between UK institutions and low- and middle-income country partners addressing priority health challenges in those countries.",
    belopp: 500000,
    beloppMax: 2000000,
    deadline: new Date("2026-09-30"),
    kategorier: ["Health & medicine", "Public health", "Global health", "International cooperation"],
    målgrupp: ["Researchers", "Academics", "Public health professionals"],
    url: "https://www.nihr.ac.uk/funding-and-support/funding-for-research-studies/funding-programmes/global-health-research/",
    land: "GB",
  },
  {
    naam: "Royal College of Psychiatrists Research Prize",
    organisation: "Royal College of Psychiatrists",
    beskrivning:
      "Recognises outstanding research by psychiatrists in training or early career, with funds awarded to support further research activities in mental health and psychiatry.",
    belopp: 5000,
    deadline: new Date("2026-06-01"),
    kategorier: ["Health & medicine", "Psychiatry", "Mental health", "Research"],
    målgrupp: ["Psychiatrists", "Trainees", "Early-career clinicians"],
    url: "https://www.rcpsych.ac.uk/members/awards-and-prizes/research-prize",
    land: "GB",
  },
  {
    namn: "Alzheimer's Research UK PhD Scholarship",
    organisation: "Alzheimer's Research UK",
    beskrivning:
      "Fully funds exceptional PhD students to undertake dementia research, covering stipend, tuition fees and research expenses at UK universities. Aims to develop the next generation of dementia scientists.",
    belopp: 22000,
    deadline: new Date("2026-10-31"),
    kategorier: ["Health & medicine", "Neuroscience", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Graduates", "Neuroscientists"],
    url: "https://www.alzheimersresearchuk.org/research/for-researchers/our-funding/phd-scholarships/",
    land: "GB",
  },
  {
    namn: "Wellcome Trust Collaborative Award in Science",
    organisation: "Wellcome Trust",
    beskrivning:
      "Funds teams of researchers working collaboratively across institutions on ambitious programmes addressing important questions in biomedical science or public health.",
    belopp: 1000000,
    beloppMax: 5000000,
    deadline: new Date("2026-11-01"),
    kategorier: ["Health & medicine", "Biomedical science", "Research", "Public health"],
    målgrupp: ["Research teams", "Academics", "Scientists"],
    url: "https://wellcome.org/grant-funding/schemes/collaborative-awards-science",
    land: "GB",
  },
  {
    namn: "Florence Nightingale Foundation Leadership Scholarship",
    organisation: "Florence Nightingale Foundation",
    beskrivning:
      "Enables senior nurses and midwives to undertake a bespoke leadership development programme, including an international placement, designed to accelerate their impact on patient care and the profession.",
    belopp: 15000,
    beloppMax: 20000,
    deadline: new Date("2026-05-15"),
    kategorier: ["Health & medicine", "Nursing", "Leadership", "Professional development"],
    målgrupp: ["Senior nurses", "Midwives", "Healthcare leaders"],
    url: "https://florence-nightingale-foundation.org.uk/scholarships/",
    land: "GB",
  },

  // ── Technology & Engineering (12) ─────────────────────────────────────────

  {
    namn: "EPSRC Doctoral Training Partnership Studentship",
    organisation: "Engineering and Physical Sciences Research Council (EPSRC)",
    beskrivning:
      "Funds PhD students across the full range of engineering and physical sciences disciplines at UK universities, covering stipend, tuition fees and research training support.",
    belopp: 21000,
    deadline: new Date("2026-07-01"),
    kategorier: ["Technology & engineering", "PhD funding", "Engineering", "Physical sciences"],
    målgrupp: ["PhD students", "Graduates", "Engineers"],
    url: "https://www.ukri.org/opportunity/epsrc-doctoral-training-partnerships/",
    land: "GB",
  },
  {
    namn: "UKRI Future Leaders Fellowship",
    organisation: "UKRI",
    beskrivning:
      "Supports exceptional researchers and innovators at a critical stage in their careers, enabling them to establish independent research programmes or move between academia and industry.",
    belopp: 400000,
    beloppMax: 1500000,
    deadline: new Date("2026-08-01"),
    kategorier: ["Technology & engineering", "Research", "Innovation", "Leadership"],
    målgrupp: ["Early-career researchers", "Innovators", "Academics"],
    url: "https://www.ukri.org/opportunity/ukri-future-leaders-fellowships/",
    land: "GB",
  },
  {
    namn: "Shell Foundation Energy Access Grant",
    organisation: "Shell Foundation",
    beskrivning:
      "Supports entrepreneurs and organisations developing scalable clean energy solutions for underserved markets, with a focus on sub-Saharan Africa and South Asia.",
    belopp: 100000,
    beloppMax: 500000,
    deadline: new Date("2026-09-15"),
    kategorier: ["Technology & engineering", "Energy", "Sustainability", "Innovation"],
    målgrupp: ["Social entrepreneurs", "NGOs", "Energy innovators"],
    url: "https://shellfoundation.org/our-work/energy-access/",
    land: "GB",
  },
  {
    namn: "BAE Systems Engineering Scholarship",
    organisation: "BAE Systems",
    beskrivning:
      "Provides financial support and structured work placements for undergraduate engineering students studying at UK universities, covering tuition contribution and a bursary.",
    belopp: 3000,
    beloppMax: 5000,
    deadline: new Date("2026-12-15"),
    kategorier: ["Technology & engineering", "Engineering", "Undergraduate funding", "Aerospace"],
    målgrupp: ["Undergraduate students", "Engineering students", "Young people"],
    url: "https://www.baesystems.com/en/careers/careers-in-the-uk/apprentices-and-graduates/scholarships",
    land: "GB",
  },
  {
    namn: "EPSRC Centre for Doctoral Training in Digital Health",
    organisation: "Engineering and Physical Sciences Research Council (EPSRC)",
    beskrivning:
      "Trains the next generation of researchers at the intersection of engineering, data science and health, providing cohort-based doctoral education across UK university consortia.",
    belopp: 22000,
    deadline: new Date("2026-06-15"),
    kategorier: ["Technology & engineering", "IT", "Health & medicine", "PhD funding"],
    målgrupp: ["PhD students", "Graduates", "Data scientists"],
    url: "https://www.ukri.org/what-we-do/developing-people-and-skills/epsrc/doctoral-training/",
    land: "GB",
  },
  {
    namn: "Lloyd's Register Foundation Maritime Safety Research Grant",
    organisation: "Lloyd's Register Foundation",
    beskrivning:
      "Funds research that advances safety in the maritime and offshore industries, including vessel design, navigation systems, human factors and environmental risk management.",
    belopp: 150000,
    beloppMax: 400000,
    deadline: new Date("2026-10-31"),
    kategorier: ["Technology & engineering", "Maritime", "Safety research", "Research"],
    målgrupp: ["Researchers", "Academics", "Maritime professionals"],
    url: "https://www.lrfoundation.org.uk/funding/research-grants/",
    land: "GB",
  },
  {
    namn: "UKRI Net Zero Innovation Portfolio Grant",
    organisation: "UKRI",
    beskrivning:
      "Supports innovation in clean energy technologies across offshore wind, nuclear, hydrogen and energy storage sectors to accelerate the UK's path to net zero by 2050.",
    belopp: 500000,
    beloppMax: 3000000,
    deadline: new Date("2027-02-01"),
    kategorier: ["Technology & engineering", "Energy", "Sustainability", "Innovation"],
    målgrupp: ["Innovators", "Companies", "Research institutions"],
    url: "https://www.ukri.org/what-we-do/our-main-funds-and-areas-of-support/net-zero-innovation-portfolio/",
    land: "GB",
  },
  {
    namn: "Worshipful Company of Engineers Scholarship",
    organisation: "Worshipful Company of Engineers",
    beskrivning:
      "Provides scholarships for postgraduate study in engineering disciplines at UK universities, supporting students who demonstrate engineering excellence and leadership potential.",
    belopp: 5000,
    beloppMax: 10000,
    deadline: new Date("2026-05-01"),
    kategorier: ["Technology & engineering", "Engineering", "Postgraduate funding", "Leadership"],
    målgrupp: ["Postgraduate students", "Engineers", "Young professionals"],
    url: "https://www.engineerscompany.org.uk/scholarships-awards/",
    land: "GB",
  },
  {
    namn: "Royal Academy of Engineering Research Fellowship",
    organisation: "Royal Society",
    beskrivning:
      "Enables outstanding early-career engineers to build an independent research career, with five years of funding covering salary, research expenses and professional development.",
    belopp: 60000,
    beloppMax: 80000,
    deadline: new Date("2026-09-01"),
    kategorier: ["Technology & engineering", "Research", "Engineering", "Early career"],
    målgrupp: ["Early-career engineers", "Researchers", "Academics"],
    url: "https://raeng.org.uk/programmes-and-prizes/programmes/uk-grants-and-prizes/research-fellowships",
    land: "GB",
  },
  {
    namn: "Construction Industry Training Board Scholarship",
    organisation: "Engineering and Physical Sciences Research Council (EPSRC)",
    beskrivning:
      "Supports students pursuing construction engineering and management degrees at UK universities through bursaries and paid industry placements with leading contractors.",
    belopp: 6000,
    deadline: new Date("2026-06-30"),
    kategorier: ["Technology & engineering", "Construction", "Undergraduate funding", "Industry"],
    målgrupp: ["Undergraduate students", "Construction students", "Young people"],
    url: "https://www.citb.co.uk/levy-grants-and-funding/grants/skills-and-training-fund/",
    land: "GB",
  },
  {
    namn: "Made Smarter Innovation Challenge Fund",
    organisation: "UKRI",
    beskrivning:
      "Funds collaborative R&D projects that drive digital transformation in UK manufacturing, focusing on artificial intelligence, robotics and advanced connectivity technologies.",
    belopp: 200000,
    beloppMax: 1000000,
    deadline: new Date("2026-11-30"),
    kategorier: ["Technology & engineering", "Manufacturing", "IT", "Innovation"],
    målgrupp: ["Manufacturers", "Technology companies", "Research institutions"],
    url: "https://www.ukri.org/opportunity/made-smarter-innovation/",
    land: "GB",
  },
  {
    namn: "Wolfson Engineering Merit Award",
    organisation: "Wolfson Foundation",
    beskrivning:
      "Recognises exceptional engineers in the early stages of their independent careers, providing grant funding to support an innovative project of their choosing.",
    belopp: 50000,
    beloppMax: 100000,
    deadline: new Date("2027-03-01"),
    kategorier: ["Technology & engineering", "Engineering", "Research", "Innovation"],
    målgrupp: ["Early-career engineers", "Researchers", "Academics"],
    url: "https://www.wolfson.org.uk/funding/funding-by-theme/science-and-medicine/",
    land: "GB",
  },

  // ── Humanities & Social Sciences (10) ─────────────────────────────────────

  {
    namn: "British Academy Small Research Grant",
    organisation: "British Academy",
    beskrivning:
      "Funds original research in the humanities and social sciences by academics based at UK universities, supporting fieldwork, archival visits, workshops and collaborative activities.",
    belopp: 10000,
    deadline: new Date("2026-10-15"),
    kategorier: ["Humanities & social sciences", "Research", "History", "Social sciences"],
    målgrupp: ["Academics", "Researchers", "University staff"],
    url: "https://www.thebritishacademy.ac.uk/funding/small-research-grants/",
    land: "GB",
  },
  {
    namn: "Leverhulme Trust Early Career Fellowship",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Enables early-career researchers in humanities and social sciences to pursue independent research at UK universities for three years, with the host institution contributing one third of the costs.",
    belopp: 30000,
    beloppMax: 40000,
    deadline: new Date("2026-11-01"),
    kategorier: ["Humanities & social sciences", "Research", "Early career", "Philosophy"],
    målgrupp: ["Early-career researchers", "Postdoctoral researchers", "Academics"],
    url: "https://www.leverhulme.ac.uk/early-career-fellowships",
    land: "GB",
  },
  {
    namn: "Nuffield Foundation Research Grant in Social Science",
    organisation: "Nuffield Foundation",
    beskrivning:
      "Supports empirical research that examines the social and economic problems facing people in the UK and improves understanding of policy effectiveness in education, justice and welfare.",
    belopp: 100000,
    beloppMax: 500000,
    deadline: new Date("2026-07-31"),
    kategorier: ["Humanities & social sciences", "Sociology", "Research", "Policy"],
    målgrupp: ["Researchers", "Academics", "Policy analysts"],
    url: "https://www.nuffieldfoundation.org/funding/research",
    land: "GB",
  },
  {
    namn: "British Academy Global Professorships",
    organisation: "British Academy",
    beskrivning:
      "Attracts world-leading researchers from overseas to bring their expertise to UK universities in the humanities and social sciences, funding four-year posts with research expenses.",
    belopp: 120000,
    beloppMax: 200000,
    deadline: new Date("2026-09-01"),
    kategorier: ["Humanities & social sciences", "Research", "International cooperation", "Academia"],
    målgrupp: ["International researchers", "Professors", "Academics"],
    url: "https://www.thebritishacademy.ac.uk/funding/global-professorships/",
    land: "GB",
  },
  {
    namn: "Leverhulme Trust Research Project Grant",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Funds research projects of a well-defined scope in the humanities or social sciences, covering staff costs, fieldwork, materials and dissemination for up to five years.",
    belopp: 50000,
    beloppMax: 300000,
    deadline: new Date("2026-08-15"),
    kategorier: ["Humanities & social sciences", "Research", "History", "Sociology"],
    målgrupp: ["Academics", "Research teams", "Postdoctoral researchers"],
    url: "https://www.leverhulme.ac.uk/research-project-grants",
    land: "GB",
  },
  {
    namn: "AHRC Leadership Fellowship",
    organisation: "British Academy",
    beskrivning:
      "Provides established researchers in arts and humanities with protected time to pursue ambitious independent research while contributing to leadership in their discipline.",
    belopp: 80000,
    beloppMax: 120000,
    deadline: new Date("2026-12-01"),
    kategorier: ["Humanities & social sciences", "Arts", "Research", "Leadership"],
    målgrupp: ["Established researchers", "Academics", "Arts scholars"],
    url: "https://www.ukri.org/opportunity/ahrc-leadership-fellows/",
    land: "GB",
  },
  {
    namn: "Nuffield Foundation Oliver Bird Rheumatism Fellowship",
    organisation: "Nuffield Foundation",
    beskrivning:
      "Supports socio-legal and sociological research examining access to justice, law reform and the operation of legal institutions affecting ordinary people's lives in the UK.",
    belopp: 40000,
    beloppMax: 80000,
    deadline: new Date("2026-06-30"),
    kategorier: ["Humanities & social sciences", "Law", "Sociology", "Research"],
    målgrupp: ["Legal researchers", "Sociologists", "Academics"],
    url: "https://www.nuffieldfoundation.org/funding/law-in-society",
    land: "GB",
  },
  {
    namn: "British Academy Leverhulme Small Research Grant",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Enables individual researchers to pursue emerging ideas and shorter research projects in the humanities and social sciences, covering direct research costs.",
    belopp: 10000,
    deadline: new Date("2026-10-01"),
    kategorier: ["Humanities & social sciences", "Research", "Philosophy", "Media studies"],
    målgrupp: ["Researchers", "Academics", "Postdoctoral researchers"],
    url: "https://www.leverhulme.ac.uk/leverhulme-british-academy-small-research-grants",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Media and Society Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Funds organisations working to improve media literacy, strengthen public interest journalism and support a diverse, sustainable media landscape across the UK.",
    belopp: 50000,
    beloppMax: 200000,
    deadline: new Date("2026-09-30"),
    kategorier: ["Humanities & social sciences", "Media studies", "Journalism", "Society"],
    målgrupp: ["Media organisations", "Journalists", "Civil society"],
    url: "https://esmeefairbairn.org.uk/our-focus/our-impact/",
    land: "GB",
  },
  {
    namn: "AHRC PhD Studentship in History",
    organisation: "British Academy",
    beskrivning:
      "Funds doctoral research in history and related humanities disciplines through AHRC Doctoral Training Partnerships, covering fees, stipend and research training.",
    belopp: 20000,
    deadline: new Date("2026-05-31"),
    kategorier: ["Humanities & social sciences", "History", "PhD funding", "Research"],
    målgrupp: ["PhD students", "History graduates", "Academics"],
    url: "https://www.ukri.org/opportunity/ahrc-doctoral-training-partnerships/",
    land: "GB",
  },

  // ── Arts, Music & Literature (10) ─────────────────────────────────────────

  {
    namn: "Arts Council England National Lottery Project Grant",
    organisation: "Arts Council England",
    beskrivning:
      "Supports individual artists, collectives and organisations to create arts and culture projects for public benefit, covering a wide range of artforms including visual arts, music, theatre and literature.",
    belopp: 1000,
    beloppMax: 100000,
    deadline: new Date("2026-08-01"),
    kategorier: ["Arts, music & literature", "Visual arts", "Music", "Literature"],
    målgrupp: ["Artists", "Arts organisations", "Cultural groups"],
    url: "https://www.artscouncil.org.uk/project-grants",
    land: "GB",
  },
  {
    namn: "Royal Academy of Music Composition Scholarship",
    organisation: "Royal Academy of Music",
    beskrivning:
      "Supports outstanding composers studying at the Royal Academy of Music in London, providing financial assistance towards fees and living costs alongside access to specialist mentoring.",
    belopp: 12000,
    beloppMax: 22000,
    deadline: new Date("2026-12-01"),
    kategorier: ["Arts, music & literature", "Music", "Composers", "Postgraduate funding"],
    målgrupp: ["Composers", "Music students", "Postgraduate students"],
    url: "https://www.ram.ac.uk/study/fees-and-funding/scholarships-and-bursaries",
    land: "GB",
  },
  {
    namn: "Tate Research Fellowship",
    organisation: "Tate",
    beskrivning:
      "Supports researchers and curators working on projects that expand knowledge of modern and contemporary art, with residencies hosted across Tate's four galleries in the UK.",
    belopp: 30000,
    beloppMax: 50000,
    deadline: new Date("2026-07-01"),
    kategorier: ["Arts, music & literature", "Visual arts", "Research", "Curating"],
    målgrupp: ["Researchers", "Curators", "Art historians"],
    url: "https://www.tate.org.uk/about-us/research/fellowships-residencies",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Arts and Heritage Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Funds ambitious arts and heritage organisations working to broaden participation and improve the quality, diversity and reach of arts and cultural experiences across the UK.",
    belopp: 50000,
    beloppMax: 300000,
    deadline: new Date("2026-10-15"),
    kategorier: ["Arts, music & literature", "Heritage", "Participation", "Visual arts"],
    målgrupp: ["Arts organisations", "Cultural institutions", "Heritage bodies"],
    url: "https://esmeefairbairn.org.uk/our-focus/arts-heritage-environment/",
    land: "GB",
  },
  {
    namn: "Royal Opera House Birgit Nilsson Bursary for Singers",
    organisation: "Royal Opera House",
    beskrivning:
      "Supports exceptional young opera singers in the Jette Parker Young Artists Programme at the Royal Opera House, providing stipends, coaching and performance opportunities.",
    belopp: 18000,
    beloppMax: 22000,
    deadline: new Date("2026-09-15"),
    kategorier: ["Arts, music & literature", "Music", "Opera", "Actors"],
    målgrupp: ["Young singers", "Opera artists", "Music students"],
    url: "https://www.roh.org.uk/learning/young-artists-programme",
    land: "GB",
  },
  {
    namn: "National Lottery Heritage Fund Skills for the Future",
    organisation: "National Lottery Heritage Fund",
    beskrivning:
      "Funds organisations to create training placements and apprenticeships in heritage skills, including conservation, archive management, historic building maintenance and museum curation.",
    belopp: 50000,
    beloppMax: 500000,
    deadline: new Date("2026-11-01"),
    kategorier: ["Arts, music & literature", "Heritage", "Training", "Conservation"],
    målgrupp: ["Heritage trainees", "Apprentices", "Young people"],
    url: "https://www.heritagefund.org.uk/funding/skills-future",
    land: "GB",
  },
  {
    namn: "Arts Council England Developing Your Creative Practice",
    organisation: "Arts Council England",
    beskrivning:
      "Helps individual creative practitioners invest time in their own development, enabling them to take creative risks, experiment and develop their practice in new directions.",
    belopp: 2000,
    beloppMax: 10000,
    deadline: new Date("2026-06-01"),
    kategorier: ["Arts, music & literature", "Visual arts", "Designers", "Authors"],
    målgrupp: ["Individual artists", "Creative practitioners", "Designers"],
    url: "https://www.artscouncil.org.uk/developing-your-creative-practice",
    land: "GB",
  },
  {
    namn: "Leverhulme Trust Artists in Residence",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Places professional artists in university departments outside arts faculties to foster creative dialogue between artists and academics, producing new artworks and advancing knowledge.",
    belopp: 20000,
    beloppMax: 35000,
    deadline: new Date("2026-05-15"),
    kategorier: ["Arts, music & literature", "Research", "Visual arts", "Collaboration"],
    målgrupp: ["Professional artists", "Visual artists", "Multidisciplinary artists"],
    url: "https://www.leverhulme.ac.uk/artists-in-residence",
    land: "GB",
  },
  {
    namn: "Royal Society of Literature Giles St Aubyn Award for Non-Fiction",
    organisation: "British Academy",
    beskrivning:
      "Supports authors working on their first commissioned non-fiction book, providing a grant to cover research costs and dedicated writing time.",
    belopp: 10000,
    deadline: new Date("2026-07-31"),
    kategorier: ["Arts, music & literature", "Literature", "Authors", "Non-fiction"],
    målgrupp: ["Authors", "Writers", "Journalists"],
    url: "https://rsliterature.org/award/giles-st-aubyn-awards-for-non-fiction/",
    land: "GB",
  },
  {
    namn: "Wolfson Foundation Museum and Galleries Improvement Grant",
    organisation: "Wolfson Foundation",
    beskrivning:
      "Helps museums, galleries and arts organisations improve the quality of their visitor experience through capital projects, including gallery refurbishments, new display technologies and conservation facilities.",
    belopp: 30000,
    beloppMax: 150000,
    deadline: new Date("2027-03-15"),
    kategorier: ["Arts, music & literature", "Museums", "Heritage", "Visual arts"],
    målgrupp: ["Museums", "Galleries", "Arts organisations"],
    url: "https://www.wolfson.org.uk/funding/funding-by-theme/arts-and-humanities/",
    land: "GB",
  },

  // ── Environment & Sustainability (8) ──────────────────────────────────────

  {
    namn: "NERC Independent Research Fellowship",
    organisation: "Natural Environment Research Council (NERC)",
    beskrivning:
      "Develops the careers of early-career environmental scientists by funding independent research in any area of NERC's science remit, from atmospheric science to marine ecology.",
    belopp: 50000,
    beloppMax: 80000,
    deadline: new Date("2026-11-16"),
    kategorier: ["Environment & sustainability", "Climate research", "Marine", "Research"],
    målgrupp: ["Early-career researchers", "Environmental scientists", "Ecologists"],
    url: "https://www.ukri.org/opportunity/nerc-independent-research-fellowship/",
    land: "GB",
  },
  {
    namn: "BBSRC Doctoral Training Programme Studentship",
    organisation: "BBSRC",
    beskrivning:
      "Funds PhD students in biosciences with relevance to agriculture, food security and sustainability, hosted at BBSRC Doctoral Training Programmes across the UK.",
    belopp: 21000,
    deadline: new Date("2026-07-15"),
    kategorier: ["Environment & sustainability", "Agriculture", "Bioscience", "PhD funding"],
    målgrupp: ["PhD students", "Bioscience graduates", "Agricultural researchers"],
    url: "https://www.ukri.org/opportunity/bbsrc-doctoral-training-programmes/",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Environment Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Funds organisations working on nature recovery, sustainable food systems and climate resilience across the UK, with a focus on systemic change and long-term ecological restoration.",
    belopp: 100000,
    beloppMax: 400000,
    deadline: new Date("2026-09-01"),
    kategorier: ["Environment & sustainability", "Climate research", "Circular economy", "Nature"],
    målgrupp: ["Environmental NGOs", "Civil society", "Conservation organisations"],
    url: "https://esmeefairbairn.org.uk/our-focus/arts-heritage-environment/environment/",
    land: "GB",
  },
  {
    namn: "Joseph Rowntree Foundation Climate Justice Research Grant",
    organisation: "Joseph Rowntree Foundation",
    beskrivning:
      "Supports research examining how climate change disproportionately affects people experiencing poverty and how a just transition to net zero can be achieved without deepening inequality.",
    belopp: 80000,
    beloppMax: 200000,
    deadline: new Date("2026-08-31"),
    kategorier: ["Environment & sustainability", "Climate research", "Social justice", "Research"],
    målgrupp: ["Researchers", "Policy analysts", "Academics"],
    url: "https://www.jrf.org.uk/work/climate-and-poverty",
    land: "GB",
  },
  {
    namn: "NERC Marine Science PhD Studentship",
    organisation: "Natural Environment Research Council (NERC)",
    beskrivning:
      "Funds doctoral research in marine science including oceanography, marine biology, seabed geology and ocean-atmosphere interactions, hosted at UK universities with marine research facilities.",
    belopp: 21000,
    deadline: new Date("2026-06-01"),
    kategorier: ["Environment & sustainability", "Marine", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Marine scientists", "Oceanographers"],
    url: "https://www.ukri.org/opportunity/nerc-doctoral-landscape-awards/",
    land: "GB",
  },
  {
    namn: "Garfield Weston Foundation Conservation Grant",
    organisation: "Garfield Weston Foundation",
    beskrivning:
      "Supports conservation charities and projects across the UK working to protect wildlife habitats, restore biodiversity and connect communities with the natural environment.",
    belopp: 20000,
    beloppMax: 80000,
    deadline: new Date("2026-12-31"),
    kategorier: ["Environment & sustainability", "Conservation", "Biodiversity", "Agriculture"],
    målgrupp: ["Conservation charities", "Environmental organisations", "Community groups"],
    url: "https://garfieldweston.org/how-we-give/what-we-fund/",
    land: "GB",
  },
  {
    namn: "BBSRC Circular Economy Agri-Food Research Award",
    organisation: "BBSRC",
    beskrivning:
      "Funds innovative research to reduce waste and improve resource efficiency throughout the agri-food supply chain, supporting the transition to circular economy principles in UK food production.",
    belopp: 200000,
    beloppMax: 600000,
    deadline: new Date("2026-10-01"),
    kategorier: ["Environment & sustainability", "Circular economy", "Agriculture", "Research"],
    målgrupp: ["Researchers", "Academics", "Agri-food industry"],
    url: "https://www.ukri.org/opportunity/bbsrc-circular-economy/",
    land: "GB",
  },
  {
    namn: "National Lottery Heritage Fund Climate Action Fund",
    organisation: "National Lottery Heritage Fund",
    beskrivning:
      "Supports heritage-led projects that tackle the climate crisis by adapting historic places and collections, reducing carbon footprints and inspiring communities to act on climate change.",
    belopp: 250000,
    beloppMax: 5000000,
    deadline: new Date("2026-11-15"),
    kategorier: ["Environment & sustainability", "Climate research", "Heritage", "Community"],
    målgrupp: ["Heritage organisations", "Museums", "Community groups"],
    url: "https://www.heritagefund.org.uk/funding/climate-action-fund",
    land: "GB",
  },

  // ── Economics & Business (8) ──────────────────────────────────────────────

  {
    namn: "Nuffield Foundation Economics Education Research Grant",
    organisation: "Nuffield Foundation",
    beskrivning:
      "Supports research that improves understanding of economic inequality, financial capability and the effectiveness of economic policy interventions in improving people's lives.",
    belopp: 100000,
    beloppMax: 400000,
    deadline: new Date("2026-07-01"),
    kategorier: ["Economics & business", "Finance", "Research", "Policy"],
    målgrupp: ["Economists", "Researchers", "Policy analysts"],
    url: "https://www.nuffieldfoundation.org/funding/economics",
    land: "GB",
  },
  {
    namn: "Joseph Rowntree Foundation Poverty and Labour Market Research",
    organisation: "Joseph Rowntree Foundation",
    beskrivning:
      "Funds research into the root causes and consequences of poverty in the UK, with particular interest in labour markets, social security, housing costs and financial insecurity.",
    belopp: 80000,
    beloppMax: 250000,
    deadline: new Date("2026-09-30"),
    kategorier: ["Economics & business", "Finance", "Research", "Social sciences"],
    målgrupp: ["Researchers", "Economists", "Policy analysts"],
    url: "https://www.jrf.org.uk/work/work-and-wages",
    land: "GB",
  },
  {
    namn: "Leverhulme Trust Business History Research Award",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Funds research projects examining the history of business, trade and commerce and their relationships with society, culture and the state in the UK and internationally.",
    belopp: 50000,
    beloppMax: 200000,
    deadline: new Date("2026-08-01"),
    kategorier: ["Economics & business", "Trade", "History", "Research"],
    målgrupp: ["Business historians", "Academics", "Researchers"],
    url: "https://www.leverhulme.ac.uk/research-project-grants",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Economy and Society Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Supports organisations developing and testing new models for a fair economy, including work on social enterprise, financial inclusion, community wealth building and responsible business practices.",
    belopp: 75000,
    beloppMax: 300000,
    deadline: new Date("2026-12-01"),
    kategorier: ["Economics & business", "Management", "Social enterprise", "Finance"],
    målgrupp: ["Social enterprises", "Charities", "Researchers"],
    url: "https://esmeefairbairn.org.uk/our-focus/",
    land: "GB",
  },
  {
    namn: "ESRC Business and Management PhD Studentship",
    organisation: "Nuffield Foundation",
    beskrivning:
      "Funds doctoral research in business, management and organisational studies at UK universities through ESRC Doctoral Training Partnerships, covering fees, stipend and research costs.",
    belopp: 21000,
    deadline: new Date("2026-06-15"),
    kategorier: ["Economics & business", "Management", "PhD funding", "Research"],
    målgrupp: ["PhD students", "Business graduates", "Management researchers"],
    url: "https://www.ukri.org/opportunity/esrc-doctoral-training-partnerships/",
    land: "GB",
  },
  {
    namn: "Wellcome Trust Health Economics Research Fellowship",
    organisation: "Wellcome Trust",
    beskrivning:
      "Supports health economists and policy researchers developing robust evidence on the cost-effectiveness of health interventions to guide decision-making in the NHS and globally.",
    belopp: 100000,
    beloppMax: 250000,
    deadline: new Date("2026-10-15"),
    kategorier: ["Economics & business", "Health & medicine", "Finance", "Research"],
    målgrupp: ["Health economists", "Researchers", "Policy analysts"],
    url: "https://wellcome.org/grant-funding/schemes/health-economics-and-decision-science",
    land: "GB",
  },
  {
    namn: "British Academy International Trade Research Grant",
    organisation: "British Academy",
    beskrivning:
      "Funds research examining the economic, social and political dimensions of international trade and logistics, including the UK's post-Brexit trade relationships.",
    belopp: 20000,
    beloppMax: 80000,
    deadline: new Date("2026-11-30"),
    kategorier: ["Economics & business", "Trade", "Logistics", "Research"],
    målgrupp: ["Economists", "Academics", "Policy researchers"],
    url: "https://www.thebritishacademy.ac.uk/funding/",
    land: "GB",
  },
  {
    namn: "Garfield Weston Foundation Enterprise and Skills Grant",
    organisation: "Garfield Weston Foundation",
    beskrivning:
      "Supports charities and social enterprises helping disadvantaged people develop business and enterprise skills, access employment and build financial resilience.",
    belopp: 20000,
    beloppMax: 60000,
    deadline: new Date("2027-01-31"),
    kategorier: ["Economics & business", "Management", "Social enterprise", "Employment"],
    målgrupp: ["Charities", "Social enterprises", "Disadvantaged communities"],
    url: "https://garfieldweston.org/how-we-give/what-we-fund/",
    land: "GB",
  },

  // ── International Cooperation (8) ─────────────────────────────────────────

  {
    namn: "Chevening Scholarship",
    organisation: "Chevening Scholarships",
    beskrivning:
      "Fully funds outstanding future leaders from around the world to pursue postgraduate study at any UK university, covering tuition fees, living costs, flights and other expenses for one year.",
    belopp: 20000,
    beloppMax: 35000,
    deadline: new Date("2026-11-04"),
    kategorier: ["International cooperation", "Postgraduate funding", "Leadership", "Development aid"],
    målgrupp: ["International students", "Future leaders", "Professionals"],
    url: "https://www.chevening.org/scholarships/",
    land: "GB",
  },
  {
    namn: "Gates Cambridge Scholarship",
    organisation: "Gates Cambridge",
    beskrivning:
      "Awards full-cost scholarships to outstanding students from outside the UK to pursue postgraduate degrees at the University of Cambridge, aiming to build a global network of future leaders.",
    belopp: 20000,
    beloppMax: 40000,
    deadline: new Date("2026-10-14"),
    kategorier: ["International cooperation", "Postgraduate funding", "Leadership", "Research"],
    målgrupp: ["International students", "Postgraduate students", "Future leaders"],
    url: "https://www.gatescambridge.org/apply/",
    land: "GB",
  },
  {
    namn: "Rhodes Scholarship",
    organisation: "Rhodes Trust",
    beskrivning:
      "Funds exceptional students from 64 countries to study at the University of Oxford, covering tuition, living costs and travel for postgraduate degrees of up to three years.",
    belopp: 22000,
    beloppMax: 30000,
    deadline: new Date("2026-10-01"),
    kategorier: ["International cooperation", "Postgraduate funding", "Leadership", "Research"],
    målgrupp: ["International students", "Postgraduate students", "Future leaders"],
    url: "https://www.rhodeshouse.ox.ac.uk/scholarships/",
    land: "GB",
  },
  {
    namn: "Commonwealth Scholarship for PhD Study",
    organisation: "Commonwealth Scholarship Commission",
    beskrivning:
      "Enables citizens of Commonwealth countries to undertake PhD study at UK universities, with full funding covering tuition fees, living allowance, airfares and thesis grant.",
    belopp: 18000,
    beloppMax: 28000,
    deadline: new Date("2026-12-17"),
    kategorier: ["International cooperation", "Commonwealth", "PhD funding", "Development aid"],
    målgrupp: ["Commonwealth citizens", "PhD students", "International students"],
    url: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/",
    land: "GB",
  },
  {
    namn: "British Council Arts Grants International",
    organisation: "British Council",
    beskrivning:
      "Supports international cultural exchange and collaboration between UK-based artists and their counterparts overseas, funding residencies, co-productions, tours and joint projects.",
    belopp: 5000,
    beloppMax: 50000,
    deadline: new Date("2026-09-01"),
    kategorier: ["International cooperation", "Arts, music & literature", "Cultural exchange", "Development aid"],
    målgrupp: ["Artists", "Arts organisations", "Cultural institutions"],
    url: "https://www.britishcouncil.org/arts/international-grants",
    land: "GB",
  },
  {
    namn: "Commonwealth Shared Scholarship",
    organisation: "Commonwealth Scholarship Commission",
    beskrivning:
      "Enables talented individuals from developing Commonwealth countries to pursue one-year taught master's programmes at UK universities, fully funded with a focus on sustainable development.",
    belopp: 16000,
    beloppMax: 24000,
    deadline: new Date("2026-12-17"),
    kategorier: ["International cooperation", "Commonwealth", "Postgraduate funding", "Development aid"],
    målgrupp: ["Commonwealth citizens", "International students", "Professionals"],
    url: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
    land: "GB",
  },
  {
    namn: "British Academy Visiting Fellowship",
    organisation: "British Academy",
    beskrivning:
      "Brings distinguished humanities and social sciences scholars from overseas to UK universities for three to twelve months, fostering international research collaboration and knowledge exchange.",
    belopp: 15000,
    beloppMax: 30000,
    deadline: new Date("2026-10-01"),
    kategorier: ["International cooperation", "Research", "Humanities & social sciences", "Peace research"],
    målgrupp: ["International scholars", "Researchers", "Academics"],
    url: "https://www.thebritishacademy.ac.uk/funding/visiting-fellowships/",
    land: "GB",
  },
  {
    namn: "British Council Going Global Partnerships Grant",
    organisation: "British Council",
    beskrivning:
      "Supports partnerships between UK higher education institutions and universities in low- and middle-income countries, building sustainable research collaborations and exchange opportunities.",
    belopp: 40000,
    beloppMax: 150000,
    deadline: new Date("2026-08-15"),
    kategorier: ["International cooperation", "Higher education", "Research", "Development aid"],
    målgrupp: ["Universities", "Higher education institutions", "Academics"],
    url: "https://www.britishcouncil.org/education/he/going-global-partnerships",
    land: "GB",
  },

  // ── Pedagogy & Education (8) ──────────────────────────────────────────────

  {
    namn: "Nuffield Foundation Education Research Grant",
    organisation: "Nuffield Foundation",
    beskrivning:
      "Funds high-quality research that generates evidence to improve educational policy and practice in the UK, with particular interest in curriculum, assessment, early years and disadvantage.",
    belopp: 100000,
    beloppMax: 500000,
    deadline: new Date("2026-07-31"),
    kategorier: ["Pedagogy & education", "Research", "Early years", "Higher education"],
    målgrupp: ["Education researchers", "Academics", "Policy analysts"],
    url: "https://www.nuffieldfoundation.org/funding/education",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Learning Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Supports organisations working to improve educational outcomes for disadvantaged children and young people, including projects addressing early literacy, school exclusion and alternative provision.",
    belopp: 50000,
    beloppMax: 250000,
    deadline: new Date("2026-10-01"),
    kategorier: ["Pedagogy & education", "Early years", "Special education", "Disadvantaged learners"],
    målgrupp: ["Educational charities", "Schools", "Community organisations"],
    url: "https://esmeefairbairn.org.uk/our-focus/learning/",
    land: "GB",
  },
  {
    namn: "Wolfson Foundation Early Years Education Grant",
    organisation: "Wolfson Foundation",
    beskrivning:
      "Helps organisations improve the quality of early years provision and school buildings, funding capital projects that create better environments for young children to learn and develop.",
    belopp: 30000,
    beloppMax: 100000,
    deadline: new Date("2026-06-30"),
    kategorier: ["Pedagogy & education", "Early years", "Infrastructure", "Children"],
    målgrupp: ["Nurseries", "Schools", "Educational charities"],
    url: "https://www.wolfson.org.uk/funding/funding-by-theme/education/",
    land: "GB",
  },
  {
    namn: "Leverhulme Trust Postdoctoral Fellowship in Education",
    organisation: "Leverhulme Trust",
    beskrivning:
      "Enables early-career education researchers to develop their research programme at a UK university, with three years of salary and research expenses funded.",
    belopp: 35000,
    beloppMax: 45000,
    deadline: new Date("2026-11-01"),
    kategorier: ["Pedagogy & education", "Research", "Higher education", "Early career"],
    målgrupp: ["Early-career researchers", "Education academics", "Postdoctoral researchers"],
    url: "https://www.leverhulme.ac.uk/early-career-fellowships",
    land: "GB",
  },
  {
    namn: "British Council Teacher Excellence Scholarship",
    organisation: "British Council",
    beskrivning:
      "Funds outstanding UK-based teachers to undertake professional development internationally, building global perspectives and innovative teaching practices to bring back to their schools.",
    belopp: 5000,
    beloppMax: 10000,
    deadline: new Date("2026-05-31"),
    kategorier: ["Pedagogy & education", "Teachers", "Professional development", "International cooperation"],
    målgrupp: ["Teachers", "Educators", "School staff"],
    url: "https://www.britishcouncil.org/education/schools/teacher-development",
    land: "GB",
  },
  {
    namn: "Joseph Rowntree Foundation Education and Poverty Research",
    organisation: "Joseph Rowntree Foundation",
    beskrivning:
      "Supports research and projects addressing the relationship between poverty and educational disadvantage, examining how schools, policy and communities can improve outcomes for children in poverty.",
    belopp: 80000,
    beloppMax: 200000,
    deadline: new Date("2026-09-30"),
    kategorier: ["Pedagogy & education", "Research", "Special education", "Disadvantaged learners"],
    målgrupp: ["Researchers", "Educational charities", "Policy analysts"],
    url: "https://www.jrf.org.uk/work/education-and-young-people",
    land: "GB",
  },
  {
    namn: "AHRC Creative Arts Doctoral Studentship",
    organisation: "British Academy",
    beskrivning:
      "Funds practice-led and research doctoral degrees in creative arts, design and media through AHRC Doctoral Training Partnerships at UK universities.",
    belopp: 20000,
    deadline: new Date("2026-06-01"),
    kategorier: ["Pedagogy & education", "Arts, music & literature", "PhD funding", "Higher education"],
    målgrupp: ["PhD students", "Artists", "Creative practitioners"],
    url: "https://www.ukri.org/opportunity/ahrc-doctoral-training-partnerships/",
    land: "GB",
  },
  {
    namn: "Garfield Weston Foundation Special Educational Needs Grant",
    organisation: "Garfield Weston Foundation",
    beskrivning:
      "Funds charities and schools working to improve support, inclusion and outcomes for children and young people with special educational needs and disabilities across the UK.",
    belopp: 20000,
    beloppMax: 60000,
    deadline: new Date("2027-01-31"),
    kategorier: ["Pedagogy & education", "Special education", "Inclusion", "Children"],
    målgrupp: ["Schools", "Charities", "Special educational needs professionals"],
    url: "https://garfieldweston.org/how-we-give/what-we-fund/",
    land: "GB",
  },

  // ── Sports, Youth & Miscellaneous (8) ─────────────────────────────────────

  {
    namn: "Sport England Small Grants",
    organisation: "Sport England",
    beskrivning:
      "Helps grassroots sports clubs and community organisations increase participation in physical activity, particularly among people from under-represented groups who face barriers to sport.",
    belopp: 300,
    beloppMax: 10000,
    deadline: new Date("2026-08-31"),
    kategorier: ["Sports, youth & miscellaneous", "Sports", "Community", "Inclusion"],
    målgrupp: ["Sports clubs", "Community organisations", "Volunteers"],
    url: "https://www.sportengland.org/funds-and-campaigns/small-grants",
    land: "GB",
  },
  {
    namn: "National Lottery Heritage Fund Young Roots Grant",
    organisation: "National Lottery Heritage Fund",
    beskrivning:
      "Enables young people aged 11 to 25 to explore and celebrate their local heritage, funding projects that connect them with history, culture and community identity across the UK.",
    belopp: 3000,
    beloppMax: 50000,
    deadline: new Date("2026-10-01"),
    kategorier: ["Sports, youth & miscellaneous", "Youth", "Heritage", "Community"],
    målgrupp: ["Young people", "Youth organisations", "Schools"],
    url: "https://www.heritagefund.org.uk/funding/young-roots",
    land: "GB",
  },
  {
    namn: "Sport England Together Fund",
    organisation: "Sport England",
    beskrivning:
      "Supports projects that help people who have become less active or disengaged from sport and physical activity to get moving, with a focus on mental health and community connection.",
    belopp: 5000,
    beloppMax: 50000,
    deadline: new Date("2026-07-31"),
    kategorier: ["Sports, youth & miscellaneous", "Sports", "Mental health", "Community"],
    målgrupp: ["Community groups", "Sports organisations", "Health charities"],
    url: "https://www.sportengland.org/funds-and-campaigns/together-fund",
    land: "GB",
  },
  {
    namn: "Joseph Rowntree Foundation Volunteering for Change Grant",
    organisation: "Joseph Rowntree Foundation",
    beskrivning:
      "Supports volunteer-led projects that build community power in disadvantaged neighbourhoods, enabling residents to tackle poverty and inequality through collective action.",
    belopp: 20000,
    beloppMax: 60000,
    deadline: new Date("2026-09-15"),
    kategorier: ["Sports, youth & miscellaneous", "Volunteers", "Community", "Social justice"],
    målgrupp: ["Volunteers", "Community groups", "Disadvantaged communities"],
    url: "https://www.jrf.org.uk/work/place-and-communities",
    land: "GB",
  },
  {
    namn: "Garfield Weston Foundation Youth Development Grant",
    organisation: "Garfield Weston Foundation",
    beskrivning:
      "Funds charities working to improve the lives of young people facing disadvantage, including youth clubs, mentoring programmes and projects promoting positive activities.",
    belopp: 20000,
    beloppMax: 80000,
    deadline: new Date("2026-12-31"),
    kategorier: ["Sports, youth & miscellaneous", "Youth", "Community", "Disadvantaged young people"],
    målgrupp: ["Youth charities", "Community organisations", "Young people"],
    url: "https://garfieldweston.org/how-we-give/what-we-fund/",
    land: "GB",
  },
  {
    namn: "National Lottery Community Fund Awards for All",
    organisation: "National Lottery Heritage Fund",
    beskrivning:
      "Provides small grants for community-led projects across the UK that bring people together, build community connections and improve local places, open to a wide range of groups and activities.",
    belopp: 300,
    beloppMax: 10000,
    deadline: new Date("2026-06-30"),
    kategorier: ["Sports, youth & miscellaneous", "Community", "Regional scholarships", "Volunteers"],
    målgrupp: ["Community groups", "Volunteers", "Grassroots organisations"],
    url: "https://www.tnlcommunityfund.org.uk/funding/programmes/national-lottery-awards-for-all-england",
    land: "GB",
  },
  {
    namn: "Sport England Workforce Development Fund",
    organisation: "Sport England",
    beskrivning:
      "Invests in training and development for coaches, officials and volunteers in community sport, strengthening the workforce that supports grassroots physical activity across England.",
    belopp: 10000,
    beloppMax: 100000,
    deadline: new Date("2026-11-30"),
    kategorier: ["Sports, youth & miscellaneous", "Sports", "Volunteers", "Training"],
    målgrupp: ["Sports coaches", "Volunteers", "Sports organisations"],
    url: "https://www.sportengland.org/how-we-can-help/volunteering-and-workforce",
    land: "GB",
  },
  {
    namn: "Esmée Fairbairn Foundation Strong Communities Grant",
    organisation: "Esmée Fairbairn Foundation",
    beskrivning:
      "Supports community-led organisations strengthening local social fabric in areas of high deprivation, funding projects that bring residents together around shared interests and neighbourhood improvement.",
    belopp: 30000,
    beloppMax: 120000,
    deadline: new Date("2027-02-28"),
    kategorier: ["Sports, youth & miscellaneous", "Community", "Regional scholarships", "Social justice"],
    målgrupp: ["Community organisations", "Grassroots groups", "Residents"],
    url: "https://esmeefairbairn.org.uk/our-focus/",
    land: "GB",
  },
];

async function main() {
  console.log(`Seeding ${ukStipendier.length} UK scholarships...\n`);
  let saved = 0;
  let skipped = 0;

  for (const s of ukStipendier) {
    const exists = await prisma.stipendium.findFirst({
      where: {
        namn: { equals: s.namn, mode: "insensitive" },
        organisation: { equals: s.organisation, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (exists) {
      console.log(`  SKIP (already exists): ${s.namn}`);
      skipped++;
      continue;
    }

    await prisma.stipendium.create({
      data: {
        namn: s.namn,
        organisation: s.organisation,
        beskrivning: s.beskrivning,
        belopp: s.belopp ?? null,
        beloppMax: s.beloppMax ?? null,
        deadline: s.deadline ?? null,
        kategorier: s.kategorier,
        målgrupp: s.målgrupp,
        url: s.url,
        land: s.land,
        aktiv: true,
      },
    });
    console.log(`  OK: ${s.namn} (${s.organisation})`);
    saved++;
  }

  console.log(`\nDone. ${saved} saved, ${skipped} skipped.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
