import map from "lodash/map";

const API_BASE_URL = "https://proyecto7-fecm.onrender.com";

const state = {
  data: {
    authtoken: "",
    petData: {
      id: "",
      petName: "",
      pictureUrl: "",
      lat: 0,
      lng: 0,
      condition: "",
      userId: 0,
      zone: "",
      newPicture: false,
    },
  },
  listeners: [],

  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    if (newState.authtoken) {
      localStorage.setItem("authtoken", JSON.stringify(newState.authtoken));
    }
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  async authUser(email) {
    const res = await fetch(API_BASE_URL + "/check", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const resJson = await res.json();
    return resJson;
  },
  async signUp(userData) {
    const currentState = this.getState();

    const res = await fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: currentState.userEmail,
        name: userData.name,
        password: userData.password,
      }),
    });

    const resJson = await res.json();
    return resJson;
  },

  async signIn(password) {
    const currentState = this.getState();

    const res = await fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: currentState.userEmail,
        password,
      }),
    });

    const resJson = await res.json();

    currentState.authtoken = resJson;

    console.log(currentState.authtoken);

    state.setState(currentState);
    return true;
  },

  async myInfo() {
    const currentState = state.getState();
    const res = await fetch(API_BASE_URL + "/me", {
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken}`,
      },
    });

    const resJson = await res.json();
    return resJson;
  },

  async petsAround(coordinates) {
    const currentState = this.getState();
    currentState.userLocation = coordinates;
    console.log(coordinates, "AVERGAAAA");

    const res = await fetch(
      API_BASE_URL +
        "/pets-around?lat=" +
        coordinates.lat +
        "&lng=" +
        coordinates.lng,
      {
        headers: {
          "content-type": "application/json",
          authorization: `bearer ${currentState.authtoken.token}`,
        },
      }
    );
    const resJson = await res.json();
    currentState.petsAround = resJson;
    state.setState(currentState);
  },
  setposition(data, zone) {
    const coordinates = {
      lat: data[1],
      lng: data[0],
    };

    const currentState = state.getState();
    currentState.coordinates = coordinates;
    currentState.petZone = zone;

    if (currentState.petData) {
      currentState.petData.lat = data[1];
      currentState.petData.lng = data[0];
      currentState.petData.zone = zone;
    }
    state.setState(currentState);
  },
  //da de alta una nueva mascota
  async createPet(petData) {
    const currentState = this.getState();

    const res = await fetch(API_BASE_URL + "/pets", {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken.token}`,
      },
      body: JSON.stringify(petData),
    });

    const resJson = await res.json();

    return resJson;
  },
  //obtiene los datos de una mascota y los guarda en el state
  async getPetData(petId) {
    const currentState = this.getState();

    const res = await fetch(API_BASE_URL + "/pets/" + petId, {
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken.token}`,
      },
    });
    const resJson = await res.json();
    const petData = {
      id: resJson.id,
      name: resJson.name,
      pictureUrl: resJson.pictureUrl,
      lat: resJson.lat,
      lng: resJson.lng,
      userId: resJson.userId,
      zone: resJson.zone,
    };
    currentState.petData = petData;

    state.setState(currentState);
  },

  //OBTIENE LOS DATOS DE LA MASCOTAS
  async getMyPets() {
    const currentState = this.getState();
    const res = await fetch(API_BASE_URL + "/me/pets/", {
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken.token}`,
      },
    });

    const resJson = await res.json();
    this.setState({
      ...currentState,
      pets: resJson.pets,
    });

    return resJson;
  },

  //EDITA UNA MASCOTA
  async editPet(params) {
    const currentState = this.getState();
    const res = await fetch(API_BASE_URL + `/pets/${currentState.petData.id}`, {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken.token}`,
      },
      body: JSON.stringify(params),
    });
    const resJson = await res.json();
    return resJson;
  },

  async deletePet(petID: number) {
    const currentState = this.getState();
    const res = await fetch(API_BASE_URL + "/pets/" + petID, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken.token}`,
      },
    });

    const resJson = await res.json();
    return resJson;
  },

  async editMyInfo(params) {
    const currentState = this.getState();
    const res = await fetch(API_BASE_URL + "/me", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${currentState.authtoken}`,
      },
      body: JSON.stringify(params),
    });
    const resJson = await res.json();
    return resJson;
  },
};

export { state };
