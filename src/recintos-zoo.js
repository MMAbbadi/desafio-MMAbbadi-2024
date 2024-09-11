class RecintosZoo {
  constructor() {
    this.enclosures = [
      {
        id: 1,
        bioma: "savana",
        totSize: 10,
        sizeOcupied: 3,
        animals: { macaco: 3 },
      },
      { id: 2, bioma: "floresta", totSize: 5, sizeOcupied: 0, animals: {} },
      {
        id: 3,
        bioma: "savana e rio",
        totSize: 7,
        sizeOcupied: 2,
        animals: { gazela: 1 },
      },
      { id: 4, bioma: "rio", totSize: 8, sizeOcupied: 0, animals: {} },
      {
        id: 5,
        bioma: "savana",
        totSize: 9,
        sizeOcupied: 3,
        animals: { leao: 1 },
      },
    ];

    this.animals = [
      { animId: 1, species: "LEAO", size: 3, biomas: ["savana"] },
      { animId: 2, species: "LEOPARDO", size: 2, biomas: ["savana"] },
      { animId: 3, species: "CROCODILO", size: 3, biomas: ["rio"] },
      { animId: 4, species: "MACACO", size: 1, biomas: ["savana", "floresta"] },
      { animId: 5, species: "GAZELA", size: 2, biomas: ["savana"] },
      { animId: 6, species: "HIPOPOTAMO", size: 4, biomas: ["savana", "rio"] },
    ];
  }

  // Função para verificar se um animal é carnívoro
  isCarnivore(species) {
    const carnivores = ["LEAO", "LEOPARDO", "CROCODILO"];
    return carnivores.includes(species.toUpperCase());
  }

  // Função para verificar se um recinto pode alocar um animal
  canAllocate(animal, enclosure) {
    // Verifica se o bioma do animal é compatível com o bioma do recinto
    if (!animal.biomas.includes(enclosure.bioma)) {
      return false;
    }

    // Calcula o espaço necessário para o novo animal
    let espaçoNecessário = animal.size;

    // Adiciona um espaço extra se já houver outros animals no recinto
    if (Object.keys(enclosure.animals).length > 0) {
      espaçoNecessário += 1;
    }

    // Verifica se o recinto tem espaço suficiente
    if (espaçoNecessário <= enclosure.totSize - enclosure.sizeOcupied) {
      // Regras adicionais para hipopótamos e macacos
      if (
        animal.species === "HIPOPOTAMO" &&
        enclosure.bioma !== "savana e rio"
      ) {
        return false;
      }
      if (
        animal.species === "MACACO" &&
        Object.keys(enclosure.animals).length === 0
      ) {
        return false;
      }
      // Verifica se o recinto já tem carnívoros e não permite adicionar mais carnívoros de outras espécies
      const animaisNoRecinto = Object.keys(enclosure.animals);
      if (
        this.isCarnivore(animal.species) &&
        animaisNoRecinto.some((e) => this.isCarnivore(e))
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  // Função para verificar se todos os animals do recinto se sentirão confortáveis após a alocação
  willAllAnimalsBeComfortable(animal, enclosure) {
    const animaisNoRecinto = Object.keys(enclosure.animals);
    // Verifica a regra de carnívoros
    if (this.isCarnivore(animal.species)) {
      if (
        animaisNoRecinto.some(
          (e) => this.isCarnivore(e) && e !== animal.species
        )
      ) {
        return false;
      }
    }
    // Verifica a regra de macacos
    if (animal.species === "MACACO" && animaisNoRecinto.length === 0) {
      return false;
    }
    // Verifica a regra de hipopótamos
    if (animal.species === "HIPOPOTAMO" && enclosure.bioma !== "savana e rio") {
      return false;
    }
    return true;
  }

  // Função para alocar um grupo de animals em um recinto
  allocateAnimals(animalGroup, enclosure) {
    if (!animalGroup.every((animal) => this.canAllocate(animal, enclosure))) {
      return false;
    }

    // Verifica se todos os animals do recinto estarão confortáveis após a alocação
    for (const animal of animalGroup) {
      if (!this.willAllAnimalsBeComfortable(animal, enclosure)) {
        return false;
      }
    }

    // Atualiza o recinto com os novos animals
    for (const animal of animalGroup) {
      if (!enclosure.animals[animal.species]) {
        enclosure.animals[animal.species] = 0;
      }
      enclosure.animals[animal.species] += 1;
      enclosure.sizeOcupied += animal.size;
    }
    return true;
  }

  // Função para encontrar o animal na lista de animals
  findAnimalBySpecies(species) {
    return this.animals.find(
      (animal) => animal.species === species.toUpperCase()
    );
  }

  // Função para processar a entrada do usuário e retornar os recintos viáveis ou mensagens de erro
  processAnimalEntry(species, quantity) {
    // Valida as entradas
    if (
      !species ||
      !quantity ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) { //Se qualquer um dos parametros acima forem falsos, retorna "Quantidade invalida"
      return "Quantidade inválida";
    }

    const animal = this.findAnimalBySpecies(species);

    if (!animal) { // Se animal for diferente dos da lista inicial, retornar "Animal invalido"
      return "Animal inválido";
    }

    const animalGroup = Array(quantity).fill(animal);
    const viableEnclosures = [];

    for (const enclosure of this.enclosures) {
      if (this.allocateAnimals(animalGroup, enclosure)) {
        const freeSpace = enclosure.totSize - enclosure.sizeOcupied;
        viableEnclosures.push(
          `Recinto ${enclosure.id} (espaço livre: ${freeSpace} total: ${enclosure.totSize})`
        );
      }
    }

    if (viableEnclosures.length === 0) {
      return "Não há recinto viável";
    }

    return viableEnclosures.sort(
      (a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0]
    );
  }

  // Função principal que deve ser chamada para análise dos recintos
  analisaRecintos(animal, quantidade) {
    const resultado = this.processAnimalEntry(animal, quantidade);
    if (typeof resultado === "string") {
      return { erro: resultado, recintosViaveis: [] };
    }
    return { erro: null, recintosViaveis: resultado };
  }
}

export { RecintosZoo as RecintosZoo };
