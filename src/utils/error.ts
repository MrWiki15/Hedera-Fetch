export function errorLog(erros: Error) {
  try {
    console.log(" ");
    console.log(" ");
    console.info(
      "-------------------------Error details-------------------------"
    );
    console.log("Name: ", erros.name);
    console.log("Message: ", erros.message);
    console.log(" ");
    console.log(" ");
    console.log("Error Stack--------------------------");
    console.log(erros.stack);
    console.info(
      "---------------------------------------------------------------"
    );
    console.log(" ");
    console.log(" ");

    throw erros;
  } catch (e) {
    console.log("Ocurrio un error al mostrar el error en consola");
    console.log(e);
  }
}
