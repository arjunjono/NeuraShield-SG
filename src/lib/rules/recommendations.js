/* Recommendation templates, keyed by the categories that trigger them. */

export const RECOMMENDATION_RULES = [
  {
    when: ['sgMoneyMule'],
    title: 'Never let anyone use your bank account',
    body: 'Lending, renting, or selling your account or Singpass to move money is a crime, even if you did not know where the money came from.',
  },
  {
    when: ['sgNewNumber'],
    title: 'Call them on their old number first',
    body: 'Before sending anything to a "new number", call the person on the number you already have, or ask something only they would know.',
  },
  {
    when: ['sgEcommerce'],
    title: 'Keep payment inside the app',
    body: 'Buyers never need your card details to pay you, and you should never pay a stranger before you have the item in hand.',
  },
  {
    when: ['sgLoanScam'],
    title: 'Never pay a fee to get a loan',
    body: 'Licensed moneylenders do not collect fees upfront. Check the Ministry of Law registry before dealing with any lender.',
  },
  {
    when: ['otp', 'password', 'personalInfo'],
    title: 'Never share codes, passwords, or identity data',
    body: 'No bank, platform, or support agent will ever ask for them. A request for a code is the scam itself.',
  },
  {
    when: ['suspiciousLink', 'shortener', 'lookalikeDomain'],
    title: 'Verify links independently',
    body: 'Type the official address into your browser yourself instead of tapping links sent to you.',
  },
  {
    when: ['authority', 'brandMention', 'bankingAlarm', 'techSupport'],
    title: 'Contact the company directly',
    body: 'Close the chat, then call the official number on the back of your card or the real website.',
  },
  {
    when: ['urgency', 'scarcity'],
    title: 'Pause before acting',
    body: 'Manufactured deadlines exist to stop you thinking. A real institution will still be there in an hour.',
  },
  {
    when: ['secrecy', 'isolation'],
    title: 'Talk to a trusted adult',
    body: 'Anyone who insists on secrecy is removing your safety net. Telling one person you trust breaks the script.',
  },
  {
    when: ['financialRequest', 'paymentMethod', 'p2pApp'],
    title: 'Treat payment demands as red flags',
    body: 'Gift cards, wires, and crypto are irreversible. Legitimate organizations never demand them in chat.',
  },
  {
    when: ['remoteAccess'],
    title: 'Never grant remote access',
    body: 'If remote software was installed, disconnect from the internet, uninstall it, and change passwords from another device.',
  },
  {
    when: ['romance', 'flattery', 'guilt'],
    title: 'Reality-check the relationship',
    body: 'Reverse-image-search their photos and never send money to someone you have not met in person.',
  },
  {
    when: ['investment', 'guaranteedReturns'],
    title: 'Check before you invest',
    body: 'Verify any platform or adviser against your financial regulator. Guaranteed returns do not exist.',
  },
  {
    when: ['accountThreat', 'legalThreat', 'personalThreat', 'fear'],
    title: 'Verify threats through official channels',
    body: 'Police, courts, and banks do not deliver ultimatums by chat. Check directly before believing any threat.',
  },
  {
    when: ['sgBankImpersonation', 'sgTelcoImpersonation', 'sgGovImpersonation', 'sgParcelScam', 'sgJobScam'],
    title: 'Check with the real organisation',
    body: 'Local banks, Singpass, agencies, and couriers never verify you or collect payment through a chat link. Use the official app, or call the ScamShield Helpline at 1799.',
  },
  {
    when: ['sgPayNowTransfer'],
    title: 'Treat PayNow requests from strangers as fraud',
    body: 'PayNow and PayLah! transfers are instant and cannot be reversed. Only send money to people you know in person.',
  },
  {
    when: ['ageProbe', 'platformShift', 'trustGrooming', 'secrecyGrooming', 'boundaryTesting', 'meetingRequest', 'meetingMention', 'giftLure', 'sextortion'],
    title: 'Tell a trusted adult now',
    body: 'These are grooming warning signs. Stop replying, do not meet or send anything, and tell a parent, teacher, or school counsellor. Help123 (1800 612 3123) gives free advice on online harms. In an emergency, call 999.',
  },
]

export const SAFE_RECOMMENDATIONS = [
  {
    title: 'No pressure tactics detected',
    body: 'This conversation shows none of the manipulation signals NeuraShield looks for.',
  },
  {
    title: 'Stay alert as chats evolve',
    body: 'Scams often start friendly. Re-run the analysis if money, codes, or secrecy ever come up.',
  },
]

export const ESCALATION_RECOMMENDATION = {
  title: 'Report and block',
  body: 'Report the account on the platform where it contacted you, then block it so it cannot re-engage.',
}
