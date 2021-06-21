
require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist

} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');


console.clear();


const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    
    const tareasDB = leerDB();

    if ( tareasDB ) {
        // cargar las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }


    do {

        // imprimir el menu 
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear opcion
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;
            
            case '2':
                tareas.listadoCompleto();
            break;

            case '3': // tareas completadas
                tareas.listadoPendientesCompletadas(true);
            break;

            case '4': // tareas pendientes
                tareas.listadoPendientesCompletadas(false);
            break;

            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr);
                tareas.toggleCompletadas( ids );
            break;
            
            case '6': // borrar tarea
                const id = await listadoTareasBorrar( tareas.listadoArr );
            
                if (id !== '0') {
                    // preguntar si esta seguro3
                    const ok = await confirmar('¿Esta seguro?');

                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }   
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' );

}

main();