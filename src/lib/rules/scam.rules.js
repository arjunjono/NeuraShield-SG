import { defineRules } from './helpers'

export default defineRules('scam', 'Scam Pattern Analyzer', {
  bankingAlarm: {
    label: 'Banking scam script',
    color: 'primary',
    weight: 12,
    technique: 'Fear',
    explain: {
      why: 'Classic bank-fraud opener: security alerts, failed transactions, demands to "verify your account".',
      use: 'The script mimics real fraud alerts closely enough to trigger panic, then hijacks the verification step.',
      respond: 'Real banks freeze suspicious transactions on their own. Call the number on your card, not the one in the message.',
    },
    patterns: [
      /\b(security alert|verify your (bank )?account|bank verification|unusual activity (detected|on your account)|transaction (failed|declined|flagged)|detected suspicious (activity|transactions?))\b/gi,
    ],
  },
  romance: {
    label: 'Romance scam script',
    color: 'accent',
    weight: 14,
    technique: 'Flattery',
    explain: {
      why: 'The long-distance sweetheart with a sudden crisis: overseas work, customs fees, medical bills, plane tickets.',
      use: 'Weeks of manufactured intimacy make one "emergency" feel like a test of your love rather than a request from a stranger.',
      respond: 'Never send money to someone you have not met in person: no exceptions, however real it feels.',
    },
    patterns: [
      /\b(i'?m (overseas|deployed|on (a )?(ship|rig|base)|stuck at customs)|customs (fee|is holding)|medical bills?|plane ticket|deployment|oil rig|flying (straight )?to you|once i'?m paid)\b/gi,
    ],
  },
  investment: {
    label: 'Investment scam script',
    color: 'accent',
    weight: 15,
    technique: 'Greed',
    explain: {
      why: 'Promises of easy wealth: exclusive opportunities, trading groups, passive income, financial freedom.',
      use: 'Greed is the one lever that makes people chase the scam instead of being chased by it.',
      respond: 'If the returns were real, they would not need strangers on the internet. Check any adviser against your regulator.',
    },
    patterns: [
      /\b(investment (opportunity|plan|group)|trading (group|platform|signals)|passive income|financial freedom|exclusive investment|mining pool|crypto investment)\b/gi,
      /\b((pm|prime minister|minister|president|lawrence wong|tharman|elon musk) (personally )?(recommends?|endorses?|backs|approved|uses)|(ai|quantum|robot|bot) trading (platform|bot|app|system)|(citizens|singaporeans|members|people) are earning \$?[\d,]+|earning \$?[\d,]+ (a|per|every) (day|week))\b/gi,
    ],
  },
  guaranteedReturns: {
    label: 'Guaranteed returns',
    color: 'accent',
    weight: 16,
    technique: 'Greed',
    explain: {
      why: 'Promises specific, risk-free profits: guaranteed returns, doubled money, 100% profit.',
      use: '"Guaranteed" removes the one honest thing about investing: risk. No legitimate investment can promise returns.',
      respond: 'Guaranteed profit is the single most reliable scam indicator in finance. Walk away.',
    },
    patterns: [
      /\b(guaranteed (returns?|profits?|income)|double your money|100% profit|\d+% (weekly|daily|monthly)( returns?)?|risk.?free (returns?|investment)|can'?t lose)\b/gi,
    ],
  },
  techSupport: {
    label: 'Tech support scam script',
    color: 'primary',
    weight: 14,
    technique: 'Fear',
    explain: {
      why: 'Unsolicited "support" claiming your device is infected or compromised and offering to fix it.',
      use: 'Most people cannot verify a technical claim, so an invented virus is as frightening as a real one.',
      respond: 'No company monitors your computer and calls you about viruses. Close the chat; nothing is infected.',
    },
    patterns: [
      /\b(virus (detected|found)|(computer|device|system) is (infected|compromised)|windows support|microsoft technician|security tool|licen[sc]ed devices?|fix it remotely)\b/gi,
    ],
  },
  remoteAccess: {
    label: 'Remote access request',
    color: 'yellow',
    weight: 18,
    technique: 'Authority',
    explain: {
      why: 'Asks you to install remote-control software (AnyDesk, TeamViewer) or grant access to your device.',
      use: 'Remote access turns a phone scam into a hands-on-keyboard intrusion: they see your screen and your bank.',
      respond: 'Never install software at the request of someone who contacted you. If installed, disconnect from the internet and get help.',
    },
    patterns: [
      /\b(anydesk|teamviewer|remote (access|control|desktop)|install (this|the) (software|tool|app)|give me (access|control)|share your screen)\b/gi,
    ],
  },
  giveaway: {
    label: 'Fake giveaway script',
    color: 'warning',
    weight: 12,
    technique: 'Greed',
    explain: {
      why: 'Announces a prize you never entered to win, then attaches conditions to "claim" it.',
      use: 'A free prize creates obligation and excitement; the fee or form that follows is the actual harvest.',
      respond: 'You cannot win a lottery you never entered. Real prizes never cost money to claim.',
    },
    patterns: [
      /\b(congratulations!? you('ve| have)? (won|been selected)|claim your (prize|reward|gift)|winner of (the|our)|free (prize|gift|reward)|anniversary giveaway|lucky (winner|draw))\b/gi,
    ],
  },
})
