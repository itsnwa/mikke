export const names = [
  "Phil Taylor",
  "Tommy Hunter",
  "Micheal van Gerwen",
  "Gary Anderson",
  "Adrian Lewis",
  "Raymon van Barneveld",
  "Peter Wright",
  "Martin Adams",
  "James Wade",
  "Gerwyn Price",
  "Simon Whitlock",
  "Micheal Smith",
  "Fallon Sherrock",
  "Lisa Ashton",
  "Rob Cross",
  "Dimitri Van den Bergh",
  "Nathan Aspinall",
  "Ian White"
]

export const getRandomName = () =>
  names[Math.floor(Math.random() * names.length)]
