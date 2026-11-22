// IELTS Speaking Part 1: 40 everyday topics, four questions each, with natural model answers and a self-check list.
// Everything is original; British spelling throughout.
const T = [
  ['Your home town', [
    ['Where is your home town?', `I'm from a medium-sized city on the coast, about two hours by train from the capital. It's known for its fishing harbour and a very lively food market, so it has a friendly, busy feel.`],
    ['What do you like most about it?', `I'd say the sea. I can walk to the beach in ten minutes, and in the evenings half the town seems to be out there. For example, my friends and I often just sit on the sea wall and talk until it gets dark.`],
    ['Has your home town changed much in recent years?', `Quite a lot, actually. A new shopping centre opened a few years ago, and many of the old shops in the centre closed. It's more convenient now, but I miss the small family businesses.`],
    ['Would you recommend your home town to visitors?', `Definitely, especially in spring when the weather is mild. Visitors can try the fresh seafood, walk along the harbour and take a short boat trip. It isn't famous, so it's also much quieter than the big tourist cities.`]]],
  ['Accommodation', [
    ['Do you live in a house or a flat?', `I live in a flat on the third floor of a block built in the 1990s. It has two bedrooms, which is just enough for me and my brother.`],
    ['What is your favourite room in your home?', `Probably my bedroom, because it's the one place where I can really relax. I've got a big window and a small desk, so I often read there in the afternoons.`],
    ['Would you like to move to a different home in the future?', `Yes, I'd love a place with a small garden. I'd like to grow herbs and vegetables, which is impossible in a flat. I suppose that'll depend on my job and on prices, though.`],
    ['How could your home be improved?', `The kitchen is rather small, so I'd knock down one wall to make it open to the living room. It would let in more light, and it would be much easier to have friends over for dinner.`]]],
  ['Work', [
    ['What do you do for work?', `I work as a junior accountant in a small firm. I mostly prepare invoices and check figures, and now and then I speak to clients on the phone.`],
    ['Why did you choose that job?', `I've always been good with numbers, and my uncle, who's an accountant, told me that the work is steady and varied. It turned out he was right, so I'm quite happy with my choice.`],
    ['What do you like most about your job?', `I like finishing a difficult task and seeing everything add up. My colleagues are also very supportive. Last month, for instance, a teammate stayed late to help me meet a deadline.`],
    ['Would you like to change your job in the future?', `Maybe in five years or so. I'd like to try managing a small team, because I enjoy explaining things to other people. For now, though, I still have a lot to learn where I am.`]]],
  ['Studies', [
    ['What subject are you studying?', `I'm studying environmental science at university. It covers things like climate, water quality and how cities can use less energy.`],
    ['Why did you choose that subject?', `I grew up near a river that became polluted, and I wanted to understand why. After a school project on it, I was hooked and I've never regretted the decision.`],
    ['Is there anything you dislike about your studies?', `Honestly, the statistics module. It's necessary, but I find it dry, and I often have to read the same page three times. Fortunately, my tutor gives good examples, which helps.`],
    ['What do you plan to do after you finish?', `I hope to work for a company that advises factories on cutting waste. If that doesn't work out, I might do a master's degree abroad, because I'd enjoy studying in another culture.`]]],
  ['Weekends', [
    ['What do you usually do at the weekend?', `On Saturdays I usually do the shopping and tidy the flat, and on Sundays I try to relax. I often go for a long walk in the park or meet a friend for lunch.`],
    ['Do you prefer weekends or weekdays?', `Weekends, without a doubt, because I can plan my time myself. During the week, my days are so full that I hardly have time to think, whereas at the weekend I can just follow my mood.`],
    ['What did you do last weekend?', `I went to my grandparents' house, which is about an hour away. We cooked a big lunch together, and in the afternoon I helped my grandfather repair a fence. It was tiring but really enjoyable.`],
    ['How would your ideal weekend be different from your usual one?', `I'd love to spend it somewhere quiet in the mountains, with no phone and no emails. At the moment I always have chores, so a weekend with nothing to do would feel like a luxury.`]]],
  ['Food', [
    ['What kind of food do you like to eat?', `I love spicy food, especially curries and noodle dishes. I also enjoy simple home cooking, like soup and fresh bread, when the weather is cold.`],
    ['Is there any food that you dislike?', `Yes, I can't stand mushrooms. It's mostly the texture, which I find slimy. I've tried them cooked in lots of different ways, but I always end up leaving them on the side of the plate.`],
    ['Do you prefer eating at home or in restaurants?', `It depends. At home it's cheaper and healthier, so I do it most days. But a meal out is a nice treat, so once a fortnight I go to a restaurant with friends, mainly for the atmosphere.`],
    ['Has the food in your country changed in recent years?', `Yes, a great deal. Thirty years ago most people ate traditional dishes, but now there are fast-food chains and foreign restaurants everywhere. It's good to have the choice, though I worry that young people eat too much sugar.`]]],
  ['Music', [
    ['What kind of music do you like?', `I like a bit of everything, but mainly pop and acoustic songs. When I'm studying, I put on quiet instrumental music because lyrics distract me.`],
    ['Do you play any musical instrument?', `I used to play the guitar when I was a teenager. I stopped when I got busy with exams, but I'd like to start again. I still have the guitar at home, so there's no excuse really.`],
    ['When do you listen to music?', `Mostly on the bus to work, which takes about forty minutes. It helps me wake up in the morning and it makes the journey less boring.`],
    ['Do you think music is important in people\'s lives?', `Yes, I do. It can change your mood in seconds, and it also brings people together. For example, whenever my family has a celebration, someone starts singing and everyone joins in.`]]],
  ['Reading', [
    ['Do you enjoy reading?', `I do, although I don't read as much as I'd like to. I usually read for half an hour before bed, because it helps me switch off after a long day.`],
    ['What kind of books do you like?', `Mainly detective stories and biographies. I like detective stories because I try to guess the ending, and biographies because they show how real people overcome problems.`],
    ['Do you prefer paper books or e-books?', `Paper books, I think. I like the feel of the pages, and I don't get tired eyes. That said, e-books are handy on holiday, since I can carry a whole library in my bag.`],
    ['Did you read a lot as a child?', `Yes, I was a bookworm. My mother took me to the library every Saturday, and I used to borrow five or six books at a time. I think that habit is the reason my vocabulary is good today.`]]],
  ['Sport', [
    ['Do you play any sports?', `I play badminton once a week with colleagues, and I sometimes go swimming. I'm not especially good at either, but they keep me fit and they're good fun.`],
    ['Did you do much sport at school?', `Yes, we had a lesson almost every day. I was in the school football team for two years, and we even won a small local tournament, which I'll never forget.`],
    ['Do you like watching sport on television?', `Sometimes, mostly big events like the World Cup. I find it exciting to watch with friends, but I wouldn't watch a regular match by myself because I'd rather be doing something active.`],
    ['Should everybody do some sport?', `I think so, because it's good for both the body and the mind. It doesn't have to be competitive, though. Even a brisk walk every day makes a real difference to how people feel.`]]],
  ['Weather', [
    ['What is the weather like in your country?', `It's quite varied. Summers are hot and humid, winters are mild and rainy, and spring and autumn are very pleasant. In the north it's a bit colder than where I live.`],
    ['What is your favourite season?', `Autumn, without question. The temperature is comfortable, the leaves turn red and gold, and the light in the evenings is beautiful. I love taking photos at that time of year.`],
    ['Does the weather affect your mood?', `Definitely. On grey, rainy days I feel a bit slow and tired, but when the sun comes out I get a burst of energy. Last winter I even bought a bright lamp for my desk to cheer myself up.`],
    ['Has the weather in your area changed over the years?', `I think so. My grandparents say that winters used to be much colder, and now we hardly ever have snow. I suppose it's linked to climate change, which worries me.`]]],
  ['Shopping', [
    ['Do you like shopping?', `It depends on what I'm buying. I enjoy shopping for books and gadgets, but I find clothes shopping tiring, so I usually go with a friend to make it more fun.`],
    ['Do you prefer shopping online or in shops?', `For everyday items I shop online, because it saves time. For shoes or clothes, though, I prefer going to a shop, so that I can try things on and avoid the hassle of returns.`],
    ['What was the last thing you bought?', `A pair of wireless headphones. My old ones broke after three years, and I'd been reading reviews for weeks before I decided. So far, I'm delighted with the sound.`],
    ['Do you think people buy too many things nowadays?', `Yes, I do. Advertising makes us feel we need the newest model of everything. I've tried to buy less and fix things instead, and I've found that my flat feels much less cluttered.`]]],
  ['Transport', [
    ['How do you usually travel to work or school?', `I take the underground. It's the fastest way in rush hour, and the station is only five minutes from my flat, so it's really convenient.`],
    ['Is public transport good in your area?', `Mostly, yes. Trains and buses are frequent and quite cheap. The main problem is that they get very crowded in the morning, so you sometimes have to stand for the entire journey.`],
    ['Do you prefer to travel by car or by bus?', `I'd choose the bus, because I can read or listen to a podcast instead of concentrating on the road. Driving in the city also costs a lot for parking, so it doesn't make sense for me.`],
    ['How could the transport system in your city be improved?', `More frequent night buses would help, because the last one leaves at eleven. I'd also add more cycle lanes, so people could cycle safely instead of driving.`]]],
  ['Friends', [
    ['Do you have many friends?', `I have a small group of close friends rather than lots of acquaintances. I prefer it that way, because I can really trust them and we can talk about anything.`],
    ['How do you usually spend time with your friends?', `We often meet for coffee, play board games or go to the cinema. When the weather's good, we go for a picnic in the park, which is cheap and relaxing.`],
    ['Is it easy for you to make new friends?', `I'm a little shy at first, so it takes me a while. However, once I find something in common, like a hobby, I open up quickly. I made two good friends in my badminton group that way.`],
    ['Do you think friends are more important than family?', `I wouldn't say more important, but they're important in a different way. Family is always there, whereas friends are people you choose, so you can share things that you wouldn't tell your parents.`]]],
  ['Family', [
    ['Do you have a large family?', `Fairly large. I have two sisters and a brother, and lots of cousins who live nearby. At festivals, we all gather at my grandparents' house, and it's very noisy but wonderful.`],
    ['Who in your family are you closest to?', `My older sister. She's only two years older than me, so we've always shared our secrets. When I had a difficult time at university, she was the first person I called.`],
    ['Do you spend much time with your family?', `I try to. We have dinner together on Sundays, and I phone my parents every few days. It's not as much as I'd like, because I work long hours, but I always make an effort.`],
    ['What do you usually do together as a family?', `We cook, watch films and go on short trips at the weekend. Last month, for example, we went to a lake for the day, and my father taught my little brother to fish.`]]],
  ['Holidays', [
    ['Where do you usually go on holiday?', `I usually go somewhere with a beach, because I find the sea very relaxing. Last year I went to a small island with my cousins, and we swam and ate fresh fish every day.`],
    ['Do you prefer to travel alone or with others?', `With others, mostly. It's more fun to share the experience, and costs are lower. But I did a short solo trip once, and I enjoyed being able to decide everything myself.`],
    ['Where would you like to go in the future?', `I'd love to visit Japan. I'm fascinated by the mixture of old temples and modern cities, and I've always wanted to try the food. I'm saving up a little each month for it.`],
    ['Why do you think people like going on holiday?', `Because it gives them a break from routine. When you're somewhere new, you notice everything, and it feels like your mind gets refreshed. I always come back with more energy.`]]],
  ['Mobile phones', [
    ['How often do you use your mobile phone?', `All the time, to be honest. I use it to check messages, read the news and navigate. I probably spend about four hours a day on it, which is more than I'd like.`],
    ['What do you mainly use your phone for?', `Messaging friends and taking photos, mostly. I also use it as an alarm clock and for banking, so I'd feel quite lost without it.`],
    ['Do you think people use their phones too much?', `Yes, many of them do. You see people at restaurants looking at their screens rather than talking to each other. I try to leave mine in my bag during meals, and the conversation is much better.`],
    ['How have mobile phones changed people\'s lives?', `Enormously. We can now video call relatives abroad, pay for things and find any information in seconds. The downside is that we're always available, so it's harder to switch off from work.`]]],
  ['The internet', [
    ['How often do you use the internet?', `Every day, both for work and for fun. I look up information, watch videos and chat to friends, so it's difficult for me to imagine a day without it.`],
    ['What do you usually do online?', `In the morning I read the news, and in the evening I watch tutorials or short films. Recently I've been learning to cook from online videos, and my omelettes have improved a lot.`],
    ['Do you think the internet is safe for children?', `Not entirely. There's a lot of useful content, but also things that are unsuitable. I think parents should talk to their children about it and use filters, rather than simply banning it.`],
    ['How did people manage before the internet?', `They relied on libraries, newspapers and asking each other. It took longer to find answers, but perhaps people remembered more. I sometimes think we've become lazy, since we just search for everything.`]]],
  ['Photographs', [
    ['Do you like taking photographs?', `Yes, I do. I mostly take pictures of landscapes and food with my phone. I find that it makes me notice details that I'd otherwise miss.`],
    ['What do you usually take photos of?', `Mainly places I visit and my friends. Last month I photographed a sunrise over a lake, and I've since made it the background on my laptop.`],
    ['Do you print your photos or keep them on your phone?', `Most stay on my phone, I'm afraid. But I print the best ones once a year and put them in an album, because it's lovely to look through real pictures with my family.`],
    ['Why do people like looking at old photographs?', `Because they bring back memories and show how things used to be. When I look at my parents' wedding pictures, I'm amazed by the clothes and the hairstyles, and it makes me feel connected to my family's past.`]]],
  ['Gifts', [
    ['Do you like giving gifts?', `I really do. I enjoy thinking about what a person would like and watching them open it. Seeing a friend's smile is worth more to me than the money I spend.`],
    ['What was the last gift you received?', `A scarf from my aunt for my birthday. It's soft, dark green and very warm, and I've worn it nearly every day this winter.`],
    ['Do you prefer to give or to receive gifts?', `To give, probably. Receiving makes me a bit embarrassed, as I never know what to say. When I give something, I can relax and enjoy the other person's reaction.`],
    ['Is it important to give expensive gifts?', `Not at all. A thoughtful present, such as a handwritten card or a book that matches someone's interests, often means more than a costly one. It shows that you've paid attention.`]]],
  ['Birthdays', [
    ['How do you usually celebrate your birthday?', `Quietly, usually. I have dinner with my family and then meet a few friends at a cafe. I'm not keen on big parties, because I'd rather talk to people properly.`],
    ['Which birthday was the most memorable for you?', `My eighteenth, because my friends organised a surprise party. I came home thinking it was a normal evening, and the whole room was full of people. I was speechless.`],
    ['Do you think birthdays are important?', `I think they are, to a degree. They're a good excuse to see people you love and to think about the past year. But I don't believe that they have to involve huge expense.`],
    ['Is it common to give presents on birthdays in your country?', `Yes, it is. Friends usually bring small gifts, while parents may give something more valuable, like a watch. Some families also give money in an envelope, particularly to teenagers.`]]],
  ['Cooking', [
    ['Do you like cooking?', `Yes, I find it relaxing after a day at work. I'm no expert, but I enjoy trying new recipes, and I usually cook for friends on Fridays.`],
    ['Who cooked for you when you were a child?', `My mother, mostly. She made simple but delicious dishes, like lentil soup and rice with vegetables. On weekends, my father would sometimes make pancakes, which was a real treat.`],
    ['What is the most difficult dish that you have cooked?', `A layered cake for my sister's wedding. It collapsed twice before I got it right, so I learned that patience is the most important ingredient. In the end, everybody loved it.`],
    ['Do you think young people should learn how to cook?', `Absolutely. It saves money, and you can eat healthier food. It also gives you independence, so you're not reliant on ready meals when you move out.`]]],
  ['Art', [
    ['Do you like art?', `I do, especially painting and photography. I'm not a great artist myself, but I enjoy looking at how other people see the world.`],
    ['Did you do much art at school?', `Yes, we had one lesson a week. I remember painting a picture of our village in watercolours, and my teacher hung it on the classroom wall. I was really proud.`],
    ['Do you have any art at home?', `A few prints and a painting of a harbour that my aunt made. It hangs above my sofa, and it gives the room a calm feeling, so I never get tired of it.`],
    ['Do you think art should be taught in schools?', `Yes, I do. It encourages creativity and gives students who are not strong at academic subjects a chance to shine. Also, it teaches children to look carefully, which is a useful skill.`]]],
  ['Museums', [
    ['Do you often visit museums?', `A few times a year. I prefer history and science museums, because they usually have hands-on displays. I like to go on a weekday when it's quiet.`],
    ['What was the last museum you visited?', `A small museum of local history in my town. I learned that the main street used to be a market for spices, which I had no idea about. It was a pleasant surprise.`],
    ['Do you prefer going to museums alone or with others?', `With others, since I like discussing what we see. If I go alone, I tend to rush. With a friend, we stop and share ideas, so I remember much more.`],
    ['Should museums be free for everyone?', `I think so, at least for children and students. Museums preserve our shared heritage, and money shouldn't prevent anyone from learning about it. They could ask for voluntary donations instead.`]]],
  ['Parks', [
    ['Are there many parks in your town?', `Yes, quite a few. The biggest one has a lake and a playground, and it's only a ten-minute walk from my house. There are several smaller green areas too.`],
    ['What do people usually do in parks?', `They walk their dogs, jog, have picnics or just sit on a bench. On weekends there are also families playing football, so it's always full of life.`],
    ['Do you often go to a park?', `Almost every weekend. I like running around the lake in the morning, when the air is cool and fresh. It's a great way to clear my head.`],
    ['Why are parks important in cities?', `Because they give people space to relax and exercise. They also make the air cleaner and keep the city cooler in summer. Without parks, I think city life would feel much more stressful.`]]],
  ['Rain', [
    ['Do you like rainy days?', `Actually, yes, as long as I'm at home. I enjoy listening to the rain while I read, with a cup of tea. It makes everything seem calm.`],
    ['What do you do when it rains?', `If I have to go out, I take an umbrella and a coat. Otherwise, I stay in and cook or watch a film. On heavy-rain days, I sometimes work from home.`],
    ['Does rain cause problems where you live?', `Sometimes. During the monsoon some roads flood, and buses are delayed. Last year, I had to walk through water up to my knees, which was not fun.`],
    ['Is rain good or bad for people?', `Both, really. Farmers need it for crops, and it fills the reservoirs that give us drinking water. But too much of it can cause floods and damage homes, so it's all about balance.`]]],
  ['Noise', [
    ['Is the area where you live noisy?', `Fairly, I'd say. There's a main road nearby, so I hear traffic during the day, but it goes quiet after eleven at night.`],
    ['What kinds of noise do you dislike?', `Loud construction work and car horns. I find them stressful, because I can't concentrate. Fortunately, my windows are double-glazed, which helps a lot.`],
    ['Do you prefer to study or work in a quiet place?', `Yes, absolutely. I can't focus when there's a lot of noise, so I often go to the library. If I'm at home, I put in earplugs or play soft music.`],
    ['Do you think noise is a serious problem in cities?', `I do. It can affect people's sleep and concentration, and in the long term even their health. Some cities now restrict night-time building work, which I think is a sensible step.`]]],
  ['Mornings', [
    ['Are you a morning person?', `Not really, I'm afraid. I need at least half an hour and a strong coffee before I can talk properly. I'm much more productive in the evening.`],
    ['What do you usually do in the morning?', `I get up at seven, have a quick breakfast and check my messages. Then I leave for work at eight to avoid the worst of the traffic.`],
    ['Do you think breakfast is important?', `Yes, I do, because it gives you energy for the day. When I skip it, I get hungry and irritable by eleven. Even something simple, like yoghurt and fruit, is enough.`],
    ['Would you like to change your morning routine?', `Yes, I'd like to wake up earlier and go for a short walk. I've tried it a few times, and I felt wonderful, but it's hard to keep it up when I'm tired.`]]],
  ['Neighbours', [
    ['Do you know your neighbours well?', `I know a few of them. The couple next door are very friendly, and we chat in the corridor, but I've never met the people upstairs.`],
    ['Do you often talk to your neighbours?', `Occasionally. We exchange greetings and sometimes help each other out. Last week, for instance, my neighbour took in a parcel for me while I was at work.`],
    ['What makes a good neighbour?', `Someone who is considerate, particularly about noise, and who is friendly without being nosy. It's also good to have a neighbour you can rely on in an emergency.`],
    ['Is it important to get on with your neighbours?', `Yes, because you live so close to them every day. If you're on good terms, small problems are easy to solve, but if there's tension, even minor things can become annoying.`]]],
  ['Clothes', [
    ['What kind of clothes do you usually wear?', `Casual ones, mostly jeans and a shirt or sweater. At work, I wear smarter trousers, but I always choose comfort over fashion.`],
    ['Do you like shopping for clothes?', `Not very much. I find the shops crowded, and I never know what suits me. I tend to buy a few good items a year, rather than lots of cheap ones.`],
    ['Is fashion important to you?', `A little, but I don't follow trends closely. I'd rather have a few classic pieces that last. However, I admire people who dress creatively, because it's a form of self-expression.`],
    ['Do people in your country dress differently from the past?', `Yes, a lot. In my grandparents' time, people wore traditional clothes every day, whereas now most wear Western styles. Traditional outfits are mainly kept for weddings and festivals.`]]],
  ['Colours', [
    ['What is your favourite colour?', `Blue, particularly a deep navy. It reminds me of the sea, and I think it looks smart without being too serious.`],
    ['Do you wear a lot of that colour?', `Quite a lot, yes. About half of my wardrobe is blue or grey. My friends tease me about it, but I feel confident in those shades.`],
    ['Do colours affect your mood?', `I think they do. Bright yellow makes me feel cheerful, whereas dark colours make a room feel heavy. That's why I painted my study a soft green, which keeps me calm.`],
    ['Do colours have special meanings in your culture?', `Yes. White is linked to mourning in some parts of my country, while red is associated with luck and is worn at weddings. So people pay attention to what they wear at certain events.`]]],
  ['Bicycles', [
    ['Can you ride a bicycle?', `Yes, I learned when I was seven. My father held the back of the seat and then let go without telling me, and I rode all the way down the street.`],
    ['Do many people cycle where you live?', `Not as many as I'd like. There are some cycle lanes in the centre, but on the main roads cyclists have to share space with cars, which many people find frightening.`],
    ['Do you think cycling is a good way to travel?', `For short distances, yes. It's cheap, healthy and good for the environment. It's not ideal when the weather is bad, or when you need to carry heavy shopping.`],
    ['Should the government encourage cycling?', `I believe so. Building safe cycle lanes and offering parking would persuade more people, and it'd reduce traffic and pollution. The cost would be repaid by better public health.`]]],
  ['Films', [
    ['Do you like watching films?', `Very much. I usually watch one or two a week, either at the cinema or at home. I like thrillers, because they keep me guessing until the end.`],
    ['Do you prefer going to the cinema or watching films at home?', `The cinema, if the film is a big one, because of the huge screen and the sound. But for most films, home is more comfortable, and I can pause whenever I want.`],
    ['What was the last film you watched?', `A science-fiction film about a team travelling to a distant planet. The special effects were amazing, although I thought the ending was slightly confusing.`],
    ['Why do you think films are so popular?', `They let people escape from their daily lives for a couple of hours. A good film can also make you laugh or cry, and it often gives you something to talk about afterwards.`]]],
  ['Television', [
    ['Do you watch much television?', `Not much, about an hour a day. I prefer streaming programmes on my laptop, because I can choose when to watch them.`],
    ['What kinds of programmes do you like?', `Documentaries and cooking shows. I like learning something new while relaxing. Recently I watched a series about the deep ocean, which was fascinating.`],
    ['Did you watch a lot of television as a child?', `Yes, I did. After school, I'd watch cartoons until dinner. My parents set a limit of two hours, and I remember arguing about it quite often.`],
    ['Do you think television is good for children?', `It can be, if it's educational and in moderation. But too much screen time stops children from playing outdoors, so parents ought to balance the two.`]]],
  ['Newspapers', [
    ['Do you read newspapers?', `Rarely in print. I read the news on my phone, usually on the way to work. I look at the headlines first and then choose two or three articles.`],
    ['Which do you prefer, printed or online news?', `Online, because it's updated all the time and it's free or cheap. Still, I like the printed Sunday edition, since I can read it slowly with breakfast.`],
    ['Do many people in your country read newspapers?', `Fewer than before. Older people still buy them, but younger people get their news from social media. Many newspapers have had to move online to survive.`],
    ['Do you trust the news you read?', `I try to be careful. I check a story in more than one source before I believe it, particularly if it seems shocking. There's a lot of misleading information online.`]]],
  ['Handwriting', [
    ['Do you often write by hand?', `Not much nowadays. I take notes in meetings with a pen, and I write birthday cards, but otherwise I type everything.`],
    ['Is your handwriting easy to read?', `On a good day, yes. But when I'm in a hurry, it turns into a mess, and I sometimes can't read my own notes. My teachers were always complaining about it.`],
    ['Do you think handwriting is still important?', `I do. Studies have suggested that people remember more when they write by hand, and it also feels more personal. A handwritten letter shows that someone has made an effort.`],
    ['Should children still learn to write by hand at school?', `Yes. It trains the hand and the memory, and children also need it for exams. However, I'd also teach typing, because they will use keyboards in most jobs.`]]],
  ['Time management', [
    ['Are you good at managing your time?', `Fairly good, though not perfect. I make a list every morning, and I usually finish the main tasks. But I sometimes spend too long on small things.`],
    ['Do you use a planner or an app to organise your day?', `An app on my phone. It sends me reminders, so I don't forget deadlines. I tried a paper diary before, but I kept losing it.`],
    ['What do you do when you have too much to do?', `I choose the most urgent job and ignore everything else until it's done. If it's still too much, I ask a colleague for help, rather than staying up all night.`],
    ['Is it important to be on time in your culture?', `In business, yes, you're expected to arrive on time. For social events, people are more relaxed, and arriving fifteen minutes late is common. So it depends on the situation.`]]],
  ['Hobbies', [
    ['Do you have any hobbies?', `Yes, I enjoy hiking and baking. I go hiking about once a month with a small group, and I bake bread on Sunday afternoons.`],
    ['How did you become interested in that hobby?', `A friend invited me on a walk in the hills, and I was amazed by the views. I've been doing it ever since, and I've slowly bought better boots and equipment.`],
    ['Do you spend much money on your hobbies?', `Not a lot. Baking is cheap, and hiking only costs a bit for transport. The boots were the biggest expense, but they should last for years.`],
    ['Do you think everyone should have a hobby?', `I'd say so, since it gives you something to look forward to. It also helps people relax and meet others with similar interests, which is good for mental health.`]]],
  ['Languages', [
    ['What languages can you speak?', `I speak my mother tongue, English and a little French. My French is only enough for ordering food and asking directions, but I'm slowly improving.`],
    ['Why are you learning English?', `For work and for study. Most of my professional reading is in English, and I'd like to study abroad one day. It also lets me chat to people from many countries.`],
    ['What is the most difficult part of learning a language?', `For me, speaking, because I worry about making mistakes. I've found that practising with a patient friend helps, and I'm learning to relax and not worry about perfect grammar.`],
    ['Do you think everybody should learn a foreign language?', `Yes. It opens up job opportunities and helps you understand other cultures. Even basic phrases can make a big difference when you travel, because people appreciate the effort.`]]],
  ['Pets', [
    ['Do you have any pets?', `I have a cat called Mango. She's orange, very independent and spends most of the day sleeping on my bed.`],
    ['Why do people keep pets?', `For company, mainly. A pet gives you someone to come home to, and many people feel less lonely. Children can also learn responsibility by looking after an animal.`],
    ['Would you like to have a different pet?', `I'd love a dog, but I don't have enough space or time at the moment. When I have a house with a garden, I'll probably adopt one from a shelter.`],
    ['Is it good to keep animals in a flat?', `It depends on the animal. Cats and small pets are usually fine, but big dogs need lots of exercise, and it's unfair to keep them in a small flat all day.`]]],
  ['Sleep', [
    ['How many hours do you usually sleep?', `About seven, on average. On weekdays I get six and a half, and then I catch up a little at the weekend.`],
    ['Do you ever have trouble sleeping?', `Occasionally, especially before an important meeting. My mind starts racing, so I put my phone away and read a few pages, which usually helps.`],
    ['Do you take naps during the day?', `Only at weekends. A twenty-minute nap after lunch makes me feel refreshed, but if I sleep longer, I wake up groggy and feel worse.`],
    ['Why is sleep important?', `Because the body and the brain need time to recover. When I don't sleep enough, I can't concentrate and I make silly mistakes. I'd say it's as important as eating well.`]]],
];

const lv = [2, 3, 3, 4, 3, 2, 4, 3];
export default {
  topic: 'speaking-part1',
  items: T.map(([name, qa], i) => ({
    id: 'sp1-' + String(i + 1).padStart(2, '0'), type: 'open', level: lv[i % lv.length], exams: ['academic', 'general'],
    facets: { skill: 'speaking', part: '1', qtype: 'interview' }, sub: name,
    q: `<p><b>Topic: ${name}</b></p><ol>${qa.map(([q]) => `<li>${q}</li>`).join('')}</ol><p>Answer each question in 2 to 4 sentences: answer, reason, example.</p>`,
    timers: { speak: 120 },
    model: qa.map(([q, a]) => `<p><b>${q}</b><br>${a}</p>`).join(''),
    checklist: ['You answered the question directly in the first sentence', 'You gave at least one reason for your answer', 'You added an example or a detail from your own life', 'You sounded natural, not memorised, and spoke without long pauses', 'You used the right tenses (past for what happened, present for habits, future for plans)'],
  })),
};
