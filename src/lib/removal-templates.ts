// Korean PIPA (개인정보보호법) based removal request email templates

export interface RemovalTemplate {
  to: string;
  subject: string;
  body: string;
}

export function generatePIPARemovalRequest(
  dataController: string,
  userData: {
    name: string;
    email: string;
    phone?: string;
  },
  dataTypes: string[]
): RemovalTemplate {
  const currentDate = new Date().toLocaleDateString('ko-KR');

  const body = `[개인정보 삭제 요청]

${dataController} 귀사

저는 귀사가 보유하고 있는 저의 개인정보에 대해 「개인정보보호법」 제35조(개인정보의 열람)에 따라 삭제를 요청합니다.

▶ 삭제 요청자 정보
  성명: ${userData.name}
  이메일: ${userData.email}
  ${userData.phone ? `전화: ${userData.phone}` : ''}

▶ 삭제 대상 개인정보
  ${dataTypes.map((type) => `- ${type}`).join('\n  ')}

▶ 삭제 사유
본인의 개인정보가 무단으로 수집, 저장, 유통되고 있으며, 이는 「개인정보보호법」 제15조(개인정보 수집의 제한)를 위반합니다.

▶ 요청 일자
${currentDate}

「개인정보보호법」 제35조에 따라 다음과 같이 요청합니다:
1. 귀사가 보유하고 있는 본인의 개인정보를 확인해주시기 바랍니다.
2. 위 개인정보를 즉시 삭제해주시기 바랍니다.
3. 삭제 완료 후 서면으로 완료 사항을 통보해주시기 바랍니다.

본 요청에 대한 회신은 ${userData.email}로 부탁드립니다.

감사합니다.

----
이 요청은 개인정보 보호를 위한 정당한 권리 행사입니다.`;

  return {
    to: dataController,
    subject: `[개인정보 삭제 요청] ${userData.name} - ${currentDate}`,
    body,
  };
}

export function generateGDPRRemovalRequest(
  dataController: string,
  userData: {
    name: string;
    email: string;
  },
  dataTypes: string[]
): RemovalTemplate {
  const currentDate = new Date().toLocaleDateString('en-US');

  const body = `[Request for Deletion of Personal Data under GDPR Article 17]

To: ${dataController}

I hereby request the deletion of my personal data in accordance with Article 17 of the General Data Protection Regulation (GDPR).

▶ Requester Information
  Name: ${userData.name}
  Email: ${userData.email}

▶ Personal Data to be Deleted
  ${dataTypes.map((type) => `- ${type}`).join('\n  ')}

▶ Date of Request
${currentDate}

In accordance with Article 17 GDPR, I request:
1. Confirmation that you have identified and verified my personal data
2. Deletion of all my personal data without undue delay
3. Confirmation of the deletion in writing

Please send your response to ${userData.email}.

Thank you.`;

  return {
    to: dataController,
    subject: `[GDPR Article 17 - Data Deletion Request] ${userData.name} - ${currentDate}`,
    body,
  };
}

export const dataControllers = {
  darkweb: [
    {
      name: 'Collection #1 관리자',
      email: 'dmca@unknownservice.com',
      source: 'Collection #1',
    },
    {
      name: '123RF 개인정보보호팀',
      email: 'privacy@123rf.com',
      source: '123RF Data Breach',
    },
    {
      name: 'LinkedIn 개인정보보호팀',
      email: 'privacytickets@linkedin.com',
      source: 'LinkedIn Scrape',
    },
  ],
  databrokers: [
    {
      name: 'WhitePages',
      email: 'support@whitepages.com',
      source: 'WhitePages',
    },
    {
      name: 'Spokeo',
      email: 'optout@spokeo.com',
      source: 'Spokeo',
    },
    {
      name: 'PeopleSearch',
      email: 'optout@peoplefinder.com',
      source: 'PeopleSearch',
    },
    {
      name: 'MyLife',
      email: 'contact@mylife.com',
      source: 'MyLife',
    },
  ],
  koreanDataBrokers: [
    {
      name: '사람찾기',
      email: 'support@peoplefinder.co.kr',
      source: 'Korean People Search',
    },
    {
      name: '코리아인포',
      email: 'privacy@koreainfo.co.kr',
      source: 'Korea Info DB',
    },
  ],
};

export function generateRemovalRequestEmail(
  source: string,
  userData: {
    name: string;
    email: string;
    phone?: string;
  },
  dataTypes: string[],
  region: 'korea' | 'global' = 'korea'
): RemovalTemplate {
  if (region === 'korea') {
    return generatePIPARemovalRequest(source, userData, dataTypes);
  }
  return generateGDPRRemovalRequest(source, userData, dataTypes);
}
