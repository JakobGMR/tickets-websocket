const lblPending = document.querySelector('#lbl-pending');
const deskLabel = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has('escritorio')){
  window.location = 'index.html';
  throw new Error('Escritorio es requerido');
}

// ticket
const deskNumber = searchParams.get('escritorio');
let workingTicket = null;

deskLabel.innerText = deskNumber;

function checkTicketCount(currentCount = 0){
  if(currentCount === 0){
    noMoreAlert.classList.remove('d-none');
  }
  else{
    noMoreAlert.classList.add('d-none');
  }
  
  lblPending.innerHTML = currentCount;
}

async function loadInitialCount(){
  const pending = await fetch('/api/tickets/pending').then(resp => resp.json());
    
  checkTicketCount(pending.length);
}

async function getTicket(){
  await finishTikcet();

  const {status, ticket, message} = await fetch(`api/tickets/draw/${deskNumber}`).then(resp => resp.json());

  if(status === 'error'){
    lblCurrentTicket.innerText = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicket .innerText = ticket.number;
}

async function finishTikcet(){
  if(!workingTicket) return;

  const {status, message, ticket} = await fetch(`api/tickets/done/${workingTicket.id}`, {method: 'put'}).then(resp => resp.json());

  if(status === 'error'){
    lblCurrentTicket.innerText = message;
    return;
  }

  workingTicket = null;
  lblCurrentTicket .innerText = 'Nadie'
}

function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
      const {type, payload} = JSON.parse(event.data);
      
      if(type === 'on-ticket-count-changed'){
        checkTicketCount(payload);
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

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTikcet);

// Initialize
loadInitialCount();
connectToWebSockets();  