import { state } from "../../state";
import { capitalize } from "lodash";
import { Router } from "@vaadin/router";

customElements.define(
  "my-card",
  class extends HTMLElement {
    pets: any = [];
    async connectedCallback() {
      //Guardo en this.pets mis mascotas reportadas
      const { myPets } = await state.getMyPets();
      this.pets = myPets;
      this.render();
    }
    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .card-container{
          display:flex;  
          flex-direction:column;     
          justify-content:center;
          align-items:center;
          width:320px;
          border:solid 4px #ECF0F1 ;
          margin-bottom:20px;
          border-radius:15px;
          padding:13px 0;
      }
      .card-image{
          width:60%;
      }
      .card-info{
        text-align:center;
        padding:10px;        
      }
      .card-name{
          font-size:40px;
          font-weight:700;
          color:#ECF0F1;
          margin:0;
      }
      .card-place{
        font-size:24px;
        font-weight:700;
        color:#ECF0F1;
        margin:0 0 5px 0;
      }
      .card-link{
          color:#ECF0F1;
          text-align:center;
          font-weight:700;
          margin:0;
      }

      `;

      this.appendChild(style);

      //Por cada mascota creo una card con la informacion
      this.pets.forEach((pet) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="card-container">
            <img class="card-image" src="${pet.image}"/>
            <div class="card-info">
                <h2 class="card-name">${capitalize(pet.petName)}</h2>
                <h3 class="card-place">${capitalize(pet.place)}</h3>       
                <a class="card-link">EDITAR</a> 
            </div>    
        </div>`;

        //Si clickea en editar va a la pagina para editar
        // div.querySelector(".card-link")?.addEventListener("click", async () => {
        //   await state.setPetById(pet.id);
        //   const cs = state.getState();
        //   cs.update = true;
        //   state.setState(cs);
        //   Router.go("/pets/new");
        // });

        this.appendChild(div);
      });
    }
  }
);
