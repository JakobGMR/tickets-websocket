async function getLastWorkingOnTickets(){
    const tickets = await fetch('api/tickets/working-on').then(resp => resp.json());

    for (let i = 0; i < tickets.length; i++) {
        if(i >= 4) break;
        
        const ticket = tickets[i];
        if(!ticket.handleAtDesk) return;

        const lblCurrentTicket = document.querySelector(`#lbl-ticket-0${i + 1}`);
        const lblCurrentDesk = document.querySelector(`#lbl-desk-0${i + 1}`);
        
        lblCurrentDesk.innerHTML = ticket.handleAtDesk;
        lblCurrentTicket.innerHTML = `Ticket ${ticket.number}`;
    }
}

function connectToWebSockets() {
    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
        const {type, payload} = JSON.parse(event.data);
        if(type === 'on-working-changed'){
            getLastWorkingOnTickets();
        }
    };
  
    socket.onclose = ( event ) => {
      console.log( 'Connection closed' );
      setTimeout( () => {
        console.log( 'retrying to connect' );
        connectToWebSockets();
      }, 1500 );
  
    };
  
    socket.onopen = ( event ) => {
      console.log( 'Connected' );
    };
}
  
document.addEventListener('DOMContentLoaded', async ()=> await getLastWorkingOnTickets());
connectToWebSockets();