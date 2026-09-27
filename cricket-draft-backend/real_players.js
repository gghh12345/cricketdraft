const players = [
  {
    "id": 1,
    "name": "Rohit Sharma",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/1.jpg"
  },
  {
    "id": 2,
    "name": "Virat Kohli",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/2.jpg"
  },
  {
    "id": 3,
    "name": "Jasprit Bumrah",
    "role": "Bowler",
    "country": "IND",
    "price": 0,
    "image": "/players/3.jpg"
  },
  {
    "id": 4,
    "name": "Rishabh Pant",
    "role": "Wicket Keeper",
    "country": "IND",
    "price": 0,
    "image": "/players/4.jpg"
  },
  {
    "id": 5,
    "name": "KL Rahul",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/5.jpg"
  },
  {
    "id": 6,
    "name": "Hardik Pandya",
    "role": "All Rounder",
    "country": "IND",
    "price": 0,
    "image": "/players/6.jpg"
  },
  {
    "id": 7,
    "name": "Ravindra Jadeja",
    "role": "All Rounder",
    "country": "IND",
    "price": 0,
    "image": "/players/7.jpg"
  },
  {
    "id": 8,
    "name": "Kuldeep Yadav",
    "role": "Bowler",
    "country": "IND",
    "price": 0,
    "image": "/players/8.jpg"
  },
  {
    "id": 9,
    "name": "Mohammed Siraj",
    "role": "Bowler",
    "country": "IND",
    "price": 0,
    "image": "/players/9.jpg"
  },
  {
    "id": 10,
    "name": "Shubman Gill",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/10.jpg"
  },
  {
    "id": 30,
    "name": "Suryakumar Yadav",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/30.jpg"
  },
  {
    "id": 33,
    "name": "Yashasvi Jaiswal",
    "role": "Batter",
    "country": "IND",
    "price": 0,
    "image": "/players/33.jpg"
  },
  {
    "id": 34,
    "name": "Axar Patel",
    "role": "All Rounder",
    "country": "IND",
    "price": 0,
    "image": "/players/34.jpg"
  },
  {
    "id": 35,
    "name": "Arshdeep Singh",
    "role": "Bowler",
    "country": "IND",
    "price": 0,
    "image": "/players/35.jpg"
  },
  {
    "id": 11,
    "name": "Pat Cummins",
    "role": "Bowler",
    "country": "AUS",
    "price": 0,
    "image": "/players/11.jpg"
  },
  {
    "id": 12,
    "name": "Mitchell Starc",
    "role": "Bowler",
    "country": "AUS",
    "price": 0,
    "image": "/players/12.jpg"
  },
  {
    "id": 13,
    "name": "Steve Smith",
    "role": "Batter",
    "country": "AUS",
    "price": 0,
    "image": "/players/13.jpg"
  },
  {
    "id": 14,
    "name": "Travis Head",
    "role": "Batter",
    "country": "AUS",
    "price": 0,
    "image": "/players/14.jpg"
  },
  {
    "id": 15,
    "name": "Glenn Maxwell",
    "role": "All Rounder",
    "country": "AUS",
    "price": 0,
    "image": "/players/15.jpg"
  },
  {
    "id": 36,
    "name": "Marnus Labuschagne",
    "role": "Batter",
    "country": "AUS",
    "price": 0,
    "image": "/players/36.jpg"
  },
  {
    "id": 37,
    "name": "Adam Zampa",
    "role": "Bowler",
    "country": "AUS",
    "price": 0,
    "image": "/players/37.jpg"
  },
  {
    "id": 38,
    "name": "Josh Hazlewood",
    "role": "Bowler",
    "country": "AUS",
    "price": 0,
    "image": "/players/38.jpg"
  },
  {
    "id": 16,
    "name": "Kane Williamson",
    "role": "Batter",
    "country": "NZ",
    "price": 0,
    "image": "/players/16.jpg"
  },
  {
    "id": 17,
    "name": "Trent Boult",
    "role": "Bowler",
    "country": "NZ",
    "price": 0,
    "image": "/players/17.jpg"
  },
  {
    "id": 18,
    "name": "Rachin Ravindra",
    "role": "All Rounder",
    "country": "NZ",
    "price": 0,
    "image": "/players/18.jpg"
  },
  {
    "id": 39,
    "name": "Tim Southee",
    "role": "Bowler",
    "country": "NZ",
    "price": 0,
    "image": "/players/39.jpg"
  },
  {
    "id": 40,
    "name": "Devon Conway",
    "role": "Batter",
    "country": "NZ",
    "price": 0,
    "image": "/players/40.jpg"
  },
  {
    "id": 19,
    "name": "Ben Stokes",
    "role": "All Rounder",
    "country": "ENG",
    "price": 0,
    "image": "/players/19.jpg"
  },
  {
    "id": 20,
    "name": "Jos Buttler",
    "role": "Wicket Keeper",
    "country": "ENG",
    "price": 0,
    "image": "/players/20.jpg"
  },
  {
    "id": 21,
    "name": "Joe Root",
    "role": "Batter",
    "country": "ENG",
    "price": 0,
    "image": "/players/21.jpg"
  },
  {
    "id": 22,
    "name": "Jofra Archer",
    "role": "Bowler",
    "country": "ENG",
    "price": 0,
    "image": "/players/22.jpg"
  },
  {
    "id": 41,
    "name": "Jonny Bairstow",
    "role": "Batter",
    "country": "ENG",
    "price": 0,
    "image": "/players/41.jpg"
  },
  {
    "id": 42,
    "name": "Sam Curran",
    "role": "All Rounder",
    "country": "ENG",
    "price": 0,
    "image": "/players/42.jpg"
  },
  {
    "id": 23,
    "name": "Babar Azam",
    "role": "Batter",
    "country": "PAK",
    "price": 0,
    "image": "/players/23.jpg"
  },
  {
    "id": 24,
    "name": "Shaheen Afridi",
    "role": "Bowler",
    "country": "PAK",
    "price": 0,
    "image": "/players/24.jpg"
  },
  {
    "id": 25,
    "name": "Mohammad Rizwan",
    "role": "Wicket Keeper",
    "country": "PAK",
    "price": 0,
    "image": "/players/25.jpg"
  },
  {
    "id": 43,
    "name": "Naseem Shah",
    "role": "Bowler",
    "country": "PAK",
    "price": 0,
    "image": "/players/43.jpg"
  },
  {
    "id": 26,
    "name": "Rashid Khan",
    "role": "Bowler",
    "country": "AFG",
    "price": 0,
    "image": "/players/26.jpg"
  },
  {
    "id": 44,
    "name": "Mohammad Nabi",
    "role": "All Rounder",
    "country": "AFG",
    "price": 0,
    "image": "/players/44.jpg"
  },
  {
    "id": 45,
    "name": "Chris Gayle",
    "role": "Batter",
    "country": "WI",
    "price": 0,
    "image": "/players/45.jpg"
  },
  {
    "id": 27,
    "name": "Kagiso Rabada",
    "role": "Bowler",
    "country": "SA",
    "price": 0,
    "image": "/players/27.jpg"
  },
  {
    "id": 28,
    "name": "Quinton de Kock",
    "role": "Wicket Keeper",
    "country": "SA",
    "price": 0,
    "image": "/players/28.jpg"
  },
  {
    "id": 29,
    "name": "Heinrich Klaasen",
    "role": "Wicket Keeper",
    "country": "SA",
    "price": 0,
    "image": "/players/29.jpg"
  },
  {
    "id": 31,
    "name": "Marco Jansen",
    "role": "All Rounder",
    "country": "SA",
    "price": 0,
    "image": "/players/31.jpg"
  },
  {
    "id": 32,
    "name": "AB de Villiers",
    "role": "Batter",
    "country": "SA",
    "price": 0,
    "image": "/players/32.jpg"
  },
  {
    "id": 46,
    "name": "Andre Russell",
    "role": "All Rounder",
    "country": "WI",
    "price": 0,
    "image": "/players/46.jpg"
  },
  {
    "id": 47,
    "name": "Shai Hope",
    "role": "Batter",
    "country": "WI",
    "price": 0,
    "image": "/players/47.jpg"
  },
  {
    "id": 48,
    "name": "MS Dhoni",
    "role": "Wicket Keeper",
    "country": "IND",
    "price": 0,
    "image": "/players/48.jpg"
  },
  {
    "id": 49,
    "name": "Wanindu Hasaranga",
    "role": "All Rounder",
    "country": "SL",
    "price": 0,
    "image": "/players/49.jpg"
  },
  {
    "id": 50,
    "name": "David Warner",
    "role": "Batter",
    "country": "AUS",
    "price": 0,
    "image": "/players/50.jpg"
  },
  {
    "id": 51,
    "name": "Kusal Mendis",
    "role": "Batter",
    "country": "SL",
    "price": 0,
    "image": "/players/51.jpg"
  }
];

module.exports = players;
