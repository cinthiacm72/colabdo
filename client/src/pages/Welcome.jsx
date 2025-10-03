const Welcome = () => {
  return (
    <>
      <section className='container-fluid-s flex flex-column flex-jc-between'>
        <header
          style={{ flexGrow: "1" }}
          className='flex flex-column flex-a-center flex-jc-center'>
          <h1 className='visually-hidden'>ColabDo</h1>
          <img
            className='margin-bottom-3'
            src='/assets/imgs/logo-colabdo.svg'
            alt='ColabDo Logo'
          />
          <p className='text-accent'>Crea tareas colaborativas fácilmente.</p>
        </header>
        <div className='flex flex-column flex-gap-4'>
          <a className='button-solid-l button-solid-l-accent' href='/register'>
            ¡Registrate ahora!
          </a>
          <a className='button-outline-l button-outline-l-accent' href='/login'>
            Ya tengo una cuenta
          </a>
        </div>
      </section>
    </>
  );
};

export default Welcome;
