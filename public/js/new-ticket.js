const showTicketNumber = document.getElementById('lbl-new-ticket');
const createTicketBtn = document.querySelector('button');

async function getLastTicketNumber(){
    return (await fetch('http://localhost:3000/api/tickets/last')).json();
}

async function postCreateTicket(event){
    const newTicket = await fetch('http://localhost:3000/api/tickets', {method: 'post'}).then(resp => resp.json());

    showTicketNumber.innerText = newTicket.number;
}

createTicketBtn.addEventListener('click', postCreateTicket);

document.addEventListener('DOMContentLoaded', async ()=>{
    showTicketNumber.innerText = await getLastTicketNumber();
});