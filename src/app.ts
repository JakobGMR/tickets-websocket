import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    // routes: AppRoutes.routes,
  });

  const httpServer = createServer(server.app);
  WssService.initWss({server: httpServer, })

  server.setRoutes(AppRoutes.routes);

  // server.start();
  httpServer.listen(envs.PORT, ()=>{
    console.log(`Server running on port: ${envs.PORT}`);
  });
}