
import express, { type Router } from 'express';
import compression from 'compression';
interface Props {
    port: number;
    public_path?: string;
    routes: Router
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;
    constructor({ port, routes, public_path = "public" }: Props) {
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {

        //* Middleware
        this.app.use( express.json() ); // raw
        this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
        this.app.use( compression() ); // x-www-form-urlencoded

        //* Public Folder
        this.app.use(express.static( this.publicPath ));

        // this.app.get('*', (req, res)=>{
        //     const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
        //     res.sendFile(indexPath);
        // });

        //* Routes
        this.app.use(this.routes);

        this.app.listen(this.port, () => console.log(`Server running on port: ${this.port}`));
    }
}