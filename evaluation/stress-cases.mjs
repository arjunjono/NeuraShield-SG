/* ---------------------------------------------------------------------------
   NeuraShield SG stress cases
   Written to probe the engine with nuanced, demo-realistic input that is NOT
   in dataset.json: real bank and Singpass OTP notifications, people talking
   ABOUT scams, parents and teachers using "grooming-like" words innocently,
   typos, ALL CAPS, mixed Mandarin, WhatsApp exports, OCR-style unlabelled
   text, and Singapore scam types the original rules did not target.

   SET_A is diagnostic: its failures were used to decide engine fixes.
   SET_B is held out: written at the same time as SET_A, before any fix,
   and never used for tuning. It is the honest generalisation check.

   `ambiguous: true` marks cases where the text alone genuinely cannot settle
   the answer (a parent and a groomer can type the same words). They are
   reported separately and excluded from the headline accuracy.
--------------------------------------------------------------------------- */

const c = (id, group, expect, text, opts = {}) => ({ id, group, expect, text: text.trim(), ...opts })

export const SET_A = [
  /* ---------------- Legitimate chats that LOOK risky ---------------- */
  c('A-L01', 'legit-hard', 'legit', `DBS: Your OTP for the transfer of SGD 120.00 to TAN WEI MING is 482913. It expires in 5 minutes. Do not share this OTP with anyone. If you did not request this, call 1800 111 1111.`, { note: 'Real bank OTP notification' }),
  c('A-L02', 'legit-hard', 'legit', `Singpass: Your verification code is 552190. Never share this code with anyone, including Singpass staff.`, { note: 'Real Singpass 2FA SMS' }),
  c('A-L03', 'legit-hard', 'legit', `Kabeer: bro my aunt kena scammed last week
You: wah what happened
Kabeer: someone pretend to be from DBS, said her account got problem, then asked for her OTP
You: she gave ah?
Kabeer: ya lost like 8k. tell your parents never share OTP with anyone ok`, { note: 'Friend describing a scam' }),
  c('A-L04', 'legit-hard', 'legit', `Mum: forwarding this from the neighbourhood group
Mum: SPF advisory: scammers are impersonating bank officers and asking victims to transfer money to a safety account. Banks will never ask you to transfer funds or share your OTP. Call 1799 if unsure.`, { note: 'Forwarded police advisory', ambiguous: true }),
  c('A-L05', 'legit-hard', 'legit', `Mum: don't tell your dad about the cake ok, it's a surprise
You: ok i won't
Mum: are you home alone now? I'm stuck at work, there's leftover rice in the fridge`, { note: 'Parent: secrecy + home alone', ambiguous: true }),
  c('A-L06', 'legit-hard', 'legit', `Mr Lim: which CCA are you in again? I need to update the list
You: robotics sir
Mr Lim: ok, meet me at the staff room after school to collect your forms`, { note: 'Teacher: CCA + meet' }),
  c('A-L07', 'legit-hard', 'legit', `Coach Ravi: training moved to Saturday 9am at the school field
You: ok coach
Coach Ravi: bring your water bottle and don't be late`),
  c('A-L08', 'legit-hard', 'legit', `Mum: can you paynow me $30 for your tuition book, need to pay the teacher today
You: ok sending
Mum: thanks dear`, { note: 'Parent asks for PayNow' }),
  c('A-L09', 'legit-hard', 'legit', `SingPost: Your item SG12345678 is out for delivery today. Track at singpost.com/track-items`, { note: 'Real courier SMS' }),
  c('A-L10', 'legit-hard', 'legit', `Buyer: hi is the switch still available?
You: yes
Buyer: can do $220? I can meet at Tampines MRT tomorrow 7pm, cash on delivery
You: ok can`, { note: 'Real Carousell buyer' }),
  c('A-L11', 'legit-hard', 'legit', `Jia Hui: eh how old are you turning this year
You: 17
Jia Hui: ok noted, planning something hehe, don't tell anyone ah`),
  c('A-L12', 'legit-hard', 'legit', `Ryan: bro send me ur robux or i report you hahaha
You: lol no
Ryan: jk jk see you tmr`, { note: 'Joking threat' }),
  c('A-L13', 'legit-hard', 'legit', `You: hi, I lost my card
OCBC Support: Sorry to hear that. Please lock your card in the OCBC app under Cards, Lock card. We will never ask for your password or OTP.
You: done thanks`, { note: 'Real bank support, user-initiated' }),
  c('A-L14', 'legit-hard', 'legit', `School: Reminder that the PSLE results release is on Wednesday. Parents may log in to the portal with Singpass to view results.`),
  c('A-L15', 'legit-hard', 'legit', `Brother: can lend me $20 until friday? i forgot my wallet
You: ok sure
Brother: thanks i pay back friday confirm`),
  c('A-L16', 'legit-hard', 'legit', `Priya: look at this lol https://www.youtube.com/watch?v=dQw4w9WgXcQ
You: not again`),
  c('A-L17', 'legit-hard', 'legit', `Nabil: gg, wanna duo again tomorrow?
You: sure
Nabil: add me on discord, easier to call there`),
  c('A-L18', 'legit-hard', 'legit', `Auntie May: send me a photo of you in your graduation gown leh, grandma wants to see
You: ok later
Auntie May: so proud of you`),
  c('A-L19', 'legit-hard', 'legit', `Tutor: let's move our lessons to Zoom from next week, I'll send the link
You: ok
Tutor: click the link 5 minutes before 7pm`),
  c('A-L20', 'legit-hard', 'legit', `Singtel: Your bill of $45.60 for Sep is ready. View and pay via the My Singtel app. Singtel will never ask for your password via SMS.`, { note: 'Real telco bill' }),
  c('A-L21', 'legit-hard', 'legit', `Darsheel: eh congrats you won a free iphone!!! claim now at bit.ly/xxxx hahaha jk
You: walao don't scare me
Darsheel: the scam messages my grandma gets are so funny`, { note: 'Friend quoting a scam as a joke', ambiguous: true }),

  /* ---------------- Scams, nuanced ---------------- */
  c('A-S01', 'scam', 'scam', `Unknown: Ur DBS acc has been temporarly blocked due to suspicous login
You: what
Unknown: pls send the 6 digit code u receive to unblock asap`, { note: 'Typos' }),
  c('A-S02', 'scam', 'scam', `URGENT: YOUR POSB ACCOUNT HAS BEEN SUSPENDED. VERIFY NOW AT posb-sg-secure.com TO AVOID PERMANENT CLOSURE`, { note: 'ALL CAPS SMS' }),
  c('A-S03', 'scam', 'scam', `Unknown: hi ma, this is my new number, old phone spoil
You: ah boy? why change number
Unknown: ya phone drop into water. ma can help me transfer $900 to my friend first, i pay you back tonight
Unknown: dont call ah this number cannot receive call yet`, { note: 'Child impersonation ("new number")' }),
  c('A-S04', 'scam', 'scam', `Buyer: hi I want to buy your PS5, I already paid through Carousell protection
You: oh ok how do I get the money
Buyer: click this link to receive the payment and enter your card details to verify: carousell-payment-sg.site
You: why need my card details`, { note: 'Carousell fake buyer' }),
  c('A-S05', 'scam', 'scam', `Unknown: This is Inspector Lim from the Singapore Police Force. Your bank account is linked to a money laundering case.
You: what? i didn't do anything
Unknown: to clear your name you must transfer your savings to a safety account for investigation. do not tell anyone, this is confidential.`, { note: 'Police impersonation, safety account' }),
  c('A-S06', 'scam', 'scam', `Unknown: want to earn $500 a week easy? no experience needed
You: doing what
Unknown: just let us use your bank account to receive some payments, then transfer out. you keep 10%
You: is it legal
Unknown: confirm legal one, many students doing. just give me your ibanking login`, { note: 'Money mule recruitment of students' }),
  c('A-S07', 'scam', 'scam', `Unknown: PM Lawrence Wong personally recommends this AI trading platform, citizens are earning $3,000 a day
You: really?
Unknown: yes, register with a $250 deposit today, spots are limited`, { note: 'Deepfake celebrity investment' }),
  c('A-S08', 'scam', 'scam', `Seller: i got 2 coldplay tix, cat 1, selling at cost
You: how much
Seller: $600 for both. paynow me first then i transfer the tickets, many people asking so must be fast`, { note: 'Concert ticket scam' }),
  c('A-S09', 'scam', 'scam', `Jia Hui: hey sorry i accidentally sent my instagram code to your number, can you send it back to me?
You: huh what code
Jia Hui: the 6 digit one you just got by sms, quick quick before it expires`, { note: 'Hacked friend account, code theft' }),
  c('A-S10', 'scam', 'scam', `Unknown: bro need cash anot? fast approval one, no need check credit
You: how much can
Unknown: up to 5k. just paynow $150 admin fee first then we release lah, very fast one`, { note: 'Loan scam, Singlish' }),
  c('A-S11', 'scam', 'scam', `Recruiter: Hi! Lazada is hiring online assistants, $80-$300/day
You: what do i do
Recruiter: help boost product ratings. after first 3 tasks you need to make a deposit of $100 to upgrade your account, it will be refunded with commission`, { note: 'Task scam, formal' }),
  c('A-S12', 'scam', 'scam', `Unknown: 您好 this is DBS bank, your account has unusual activity
Unknown: 请 click the link to verify: dbs-verify-sg.xyz
You: ok`, { note: 'Mixed Mandarin' }),
  c('A-S13', 'scam', 'scam', `Unknown: Hello this is Singtel technical department, your internet has been hacked
You: really?
Unknown: please install AnyDesk so our engineer can fix it, otherwise your line will be cut today`),
  c('A-S14', 'scam', 'scam', `Daniel: I feel like I've known you forever, you're the only one who understands me
You: aww
Daniel: I'm stuck in Dubai, my account is frozen. could you lend me $2,000 for my hotel? I'll return it double once I'm back`, { note: 'Romance scam' }),
  c('A-S15', 'scam', 'scam', `CPF: You are eligible for the 2026 Cost-of-Living Support Payment of $800. Claim by 12 Oct via https://cpf-gov-sg.online/claim`, { note: 'Single fake gov SMS' }),
  c('A-S16', 'scam', 'scam', `ICA: Your passport renewal application is incomplete. Pay the $35 processing fee at ica-gov-sg.top within 24 hours or your application will be cancelled.`),

  /* ---------------- Grooming, nuanced ---------------- */
  c('A-G01', 'grooming', 'grooming', `Stranger: you seem lonely lately
You: kinda
Stranger: your parents don't really get you huh. I get you though
You: yeah
Stranger: you can always talk to me, maybe somewhere more private where nobody reads our messages`, { note: 'Slow build, no obvious keywords' }),
  c('A-G02', 'grooming', 'grooming', `Stranger: i saved the pics you sent last week
You: please delete them
Stranger: send me more or i'll share them with your school friends
Stranger: don't tell your parents or everyone will see them`, { note: 'Sextortion' }),
  c('A-G03', 'grooming', 'grooming', `Agent: hi! you have such a great look, you could be a model for our brand
You: really? how
Agent: how old are you? send me some full body photos first for the portfolio
Agent: don't tell your parents yet, we want it to be a surprise when you get the contract`, { note: 'Fake modelling agency' }),
  c('A-G04', 'grooming', 'grooming', `Jayden: eh you sec 2 right? i also sec 2 haha
You: ya how you know
Jayden: saw your tiktok. you damn cute sia. add me on snap leh, more private
Jayden: don't tell your friends ah, they kaypoh`, { note: 'Claims to be a peer, Singlish' }),
  c('A-G05', 'grooming', 'grooming', `Uncle Ben: you did so well in the tournament, I want to buy you new shoes
You: wah really
Uncle Ben: let's meet at the mall on Saturday, just the two of us, I'll pick you up`, { note: 'Gift + meeting, no secrecy' }),
  c('A-G06', 'grooming', 'grooming', `Coach_Z: you're the best player in my team, honestly you're special
You: thanks
Coach_Z: are your parents strict? you can tell me anything
Coach_Z: let's voice call tonight when they're asleep, just us`, { note: 'Online "coach"' }),
  c('A-G07', 'grooming', 'grooming', `Stranger: is anyone home with you right now?
You: no why
Stranger: can you turn on your camera? i want to see you, it's ok it's just us`),
  c('A-G08', 'grooming', 'grooming', `Mei: you're like a little sister to me
You: haha same
Mei: let's meet up at the void deck tonight, don't tell your mum I'm older ok`),
  c('A-G09', 'grooming', 'grooming', `Mark: You are very mature. I think we have a real connection.
You: Thank you.
Mark: Please keep our conversations between us. Your parents would not understand.
Mark: I would like to see you in person soon.`, { note: 'Formal English, no age' }),
  c('A-G10', 'grooming', 'grooming', `Ah Hock: girl you stay where ah
You: jurong
Ah Hock: wah near me only. how old you
You: 13
Ah Hock: steady. later i fetch you go makan, don't tell your parents ah, our secret`, { note: 'Heavy Singlish' }),

  /* ---------------- Input formats and robustness ---------------- */
  c('A-F01', 'format', 'scam', `[10/9/26, 10:41:02 PM] Unknown: Your Singpass account will be suspended today
[10/9/26, 10:41:30 PM] Me: why?
[10/9/26, 10:42:05 PM] Unknown: verify now at singpass-verify.online and provide the code we sent`, { note: 'iPhone WhatsApp export', minMessages: 3 }),
  c('A-F02', 'format', 'grooming', `09/10/2026, 22:41 - Stranger: how old are you
09/10/2026, 22:42 - You: 14
09/10/2026, 22:43 - Stranger: add me on telegram, don't tell your parents ok`, { note: 'Android WhatsApp export', minMessages: 3 }),
  c('A-F03', 'format', 'scam', `Your DBS account has been locked
What? why
Please read me the OTP we just sent
I won't give you my OTP`, { note: 'OCR-style, no names', minMessages: 2 }),
  c('A-F04', 'format', 'legit', `are you coming for dinner
ya later
ok bring umbrella it's raining`, { note: 'OCR-style legit, no names' }),
  c('A-F05', 'format', 'legit', `妈妈: 晚饭吃什么
You: anything
妈妈: ok buy bread on the way back`, { note: 'Non-Latin sender name', minMessages: 3 }),
  c('A-F06', 'format', 'scam', `send me the otp you just received, urgent`, { note: 'Single unlabelled line' }),
  c('A-F07', 'format', 'legit', ``, { note: 'Empty input' }),
  c('A-F08', 'format', 'legit', `   \n  \n `, { note: 'Whitespace only' }),
  c('A-F09', 'format', 'legit', `Ryan: <script>alert(1)</script> lol\nYou: what is that`, { note: 'HTML in a message' }),
  c('A-F10', 'format', 'legit', Array.from({ length: 200 }, (_, i) => (i % 2 ? 'You: ok can' : 'Wei Jie: later dinner at my place, paynow me for the food after')).join('\n'), { note: '200-message legit chat' }),
  c('A-F11', 'format', 'scam', `VeRiFy YoUr AcCoUnT hErE: dbs-secure-login.xyz`, { note: 'Mixed case' }),
  c('A-F12', 'format', 'scam', `DBS Security Alert: unusual activity
detected on your account.
What? Who is this?
Your account will be locked in
30 minutes. Read me the OTP we
just sent to verify your account.`, { note: 'Screenshot text whose first line contains a colon', minMessages: 5 }),
]

export const SET_B = [
  /* Legit (held out) */
  c('B-L01', 'legit-hard', 'legit', `OCBC: You've made a PayNow transfer of SGD 25.00 to JOHN TAN on 09 Oct. If unauthorised, call 6363 3333.`),
  c('B-L02', 'legit-hard', 'legit', `Grab: Your OTP is 4821. Don't share it with anyone.`),
  c('B-L03', 'legit-hard', 'legit', `Aaron: eh can paynow me back for the movie tickets, $14
You: ok sending
Aaron: received thanks`),
  c('B-L04', 'legit-hard', 'legit', `Dad: are you home? I forgot my keys, can you open the door when I reach in 10 min
You: ok`),
  c('B-L05', 'legit-hard', 'legit', `Ms Tan: Please submit your consent form by Friday. Parents need to sign it.`),
  c('B-L06', 'legit-hard', 'legit', `Kevin: did you hear sec 3 guy got job scammed? he paid $200 to unlock tasks
You: siao, how can fall for that
Kevin: ya they said like and earn, so suspicious`),
  c('B-L07', 'legit-hard', 'legit', `Cousin: we meet at changi airport T3 at 6am, don't be late
You: ok`),
  c('B-L08', 'legit-hard', 'legit', `UOB TMRW: Log in to view your monthly statement. UOB will never ask for your OTP or password.`),
  c('B-L09', 'legit-hard', 'legit', `Ryan: bro I'll gift you the battle pass for your birthday, what's your username
You: same as my insta`),
  c('B-L10', 'legit-hard', 'legit', `Mum: don't forget to bring your IC tomorrow for the passport photo
You: ok`),
  c('B-L11', 'legit-hard', 'legit', `Nabil: my phone screen cracked, any shop to fix near bugis?
You: try sim lim square`),
  c('B-L12', 'legit-hard', 'legit', `Shopee: Your order has been delivered. Tap to rate your purchase in the app.`),
  c('B-L13', 'legit-hard', 'legit', `Grandma: boy you eat already or not grandma cook curry chicken come home early ok`),
  c('B-L14', 'legit-hard', 'legit', `Mr Koh: Camp is from 12 to 14 Nov. Bring sleeping bag. Parents please sign the indemnity form.`),
  c('B-L15', 'legit-hard', 'legit', `Jia Hui: promise don't tell anyone ok, I like jia wei
You: haha ok your secret safe with me`),
  c('B-L16', 'legit-hard', 'legit', `Sister: send me a selfie in the new dress, i want to see if it fits
You: later`),

  /* Scam (held out) */
  c('B-S01', 'scam', 'scam', `Unknown: Hi, this is Standard Chartered fraud unit. A $2,400 transaction is pending on your card.
You: I didn't make it
Unknown: To cancel it, please tell me the 6 digit code that just arrived on your phone.`),
  c('B-S02', 'scam', 'scam', `Unknown: Congratulations, your number was drawn in the Singapore Pools anniversary draw! Pay a $50 release fee via PayNow to collect your $8,000 prize.`),
  c('B-S03', 'scam', 'scam', `Unknown: hello this is Shopee customer service, your order payment failed and your account will be frozen. please key in your card number and CVV here to fix it: shopee-sg-help.online`),
  c('B-S04', 'scam', 'scam', `Unknown: bro my insta kena hacked, can help me receive a code? just send me the SMS code you get`),
  c('B-S05', 'scam', 'scam', `Unknown: Hi! we are recruiting part-time reviewers, earn $50 per hotel review. you need to top up $80 first to activate your reviewer account`),
  c('B-S06', 'scam', 'scam', `Unknown: IRAS: You have an outstanding tax refund of $412. Claim it at iras-refund-sg.xyz with your Singpass login before it expires today.`),
  c('B-S07', 'scam', 'scam', `Unknown: dear, I am a doctor working with the UN in Syria. I want to send you a parcel with gifts and $50,000 but customs needs a $1,200 clearance fee`),
  c('B-S08', 'scam', 'scam', `Unknown: Your M1 line will be terminated in 2 hours due to illegal activity. Press 1 or reply YES to speak to our officer`),
  c('B-S09', 'scam', 'scam', `Unknown: hi uncle, i from the CPF board. you got extra money to withdraw, just give me your singpass password i help you apply`),
  c('B-S10', 'scam', 'scam', `Unknown: earn 30% weekly with our gold trading group, guaranteed no loss, only 5 slots left, send USDT to join`),
  c('B-S11', 'scam', 'scam', `Seller: brand new iPhone 16 $500 only, below market. paynow me deposit $200 first then i ship, cannot meet because i overseas`),
  c('B-S12', 'scam', 'scam', `Unknown: This is MOH. You have been in close contact with a case and must pay a $300 fine for not reporting. Transfer immediately to avoid arrest.`),

  /* Grooming (held out) */
  c('B-G01', 'grooming', 'grooming', `Stranger: you have really nice eyes for a sec 1 girl
You: thanks?
Stranger: let's chat on whatsapp instead, and keep this between us ok`),
  c('B-G02', 'grooming', 'grooming', `Stranger: I'll buy you the new skin you wanted
You: really??
Stranger: yes but it's our little secret, don't tell your mum or dad`),
  c('B-G03', 'grooming', 'grooming', `Stranger: what school are you from
You: why
Stranger: just curious, maybe I can come pick you up after school one day, just us`),
  c('B-G04', 'grooming', 'grooming', `Stranger: are you alone in your room?
You: yes
Stranger: send me a picture of what you're wearing`),
  c('B-G05', 'grooming', 'grooming', `Stranger: nobody understands you like I do
You: maybe
Stranger: your teachers and parents won't get it. delete our chats so they don't see`),
  c('B-G06', 'grooming', 'grooming', `Stranger: you're so grown up for 12
You: haha
Stranger: wanna meet at the playground near your block tonight? come alone`),
  c('B-G07', 'grooming', 'grooming', `Stranger: if you send me a video I'll give you $100
You: what kind of video
Stranger: just you, don't show anyone`),
  c('B-G08', 'grooming', 'grooming', `Stranger: hey I'm also 15, from a school near you
You: oh cool
Stranger: let's meet at the mrt station after school, don't tell your parents they'll overreact`),
  c('B-G09', 'grooming', 'grooming', `Stranger: you're my favourite person to talk to
You: aw
Stranger: switch to snapchat, i'll send you robux there. our secret`),
  c('B-G10', 'grooming', 'grooming', `Stranger: you can trust me with anything, I'm like a big brother
You: ok
Stranger: I want to see you in person, I'll come to your area this weekend, don't mention it at home`),
]
