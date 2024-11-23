import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";

const NuevoPassword = () => {
  const [ password , setPassword ] = useState(''); 
  const [ repetirPassword , setRepetirPassword ] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [ passwordModificado, setPasswordModificado] = useState(false);

  const [alerta , setAlerta] = useState({})

  const params = useParams();
  const {token} = params;
  

  const handleSubmit = async e=> {
    e.preventDefault();

    if ([password,repetirPassword].includes('')) {
      
      setAlerta({msg: 'Hay campos vacíos', error: true});
      return;
    };

    if (password.length<6) {
      
      setAlerta({msg: 'El password debe tener al menos 6 caracteres', error: true});
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({msg: 'Los Passwords no son iguales', error: true});
      return;
    };

    try {
      const url = `/veterinarios/olvide-password/${token}`;
      const {data} = await clienteAxios.post(url, {password});

      setAlerta({
        msg: data.msg
      });
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  
  };

  useEffect(()=>{
    const comprobarToken = async ()=> {
      try {
        await clienteAxios(`/veterinarios/olvide-password/${token}`);
        setAlerta({
          msg: 'Coloca tu Nuevo Password',
        });
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: 'Hubo un error con el enlace',
          error: true
        })
      }
    };
    comprobarToken();
  }, []); 

  const {msg} = alerta;
  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Reestablece tu Password y no pierdas acceso a tus <span className="text-black">Pacientes</span>
        </h1>
      </div>

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">

        {msg && <Alerta 
          alerta={alerta}
        />}

        {tokenValido && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="my-5">
                <label className="uppercase text-gray-600 block text-xl font-bold">
                  Nuevo Password
                </label>

                <input type="password" placeholder="Tu Password"
                      className="border w-full p-3 bg-gray-50 rounded-xl"
                      value={password} onChange={e=> setPassword(e.target.value)}
                />
                </div>

                <div className="my-5">
                  <label className="uppercase text-gray-600 block text-xl font-bold">
                    Repetir Nuevo Password
                  </label>

                  <input type="password" placeholder="Repite tu Password"
                    className="border w-full p-3 bg-gray-50 rounded-xl"
                    value={repetirPassword} onChange={e=> setRepetirPassword(e.target.value)}
                  />
              </div>

              {!passwordModificado && <input type="submit" value="guardar Nuevo Password" 
                    className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto" 
              />}
            </form>

            {passwordModificado && 
              <Link to="/" className="block text-center my-5 text-gray-500">
                Iniciar Sesión
              </Link>}
          </>
        )}
      </div>
    </>  
  )
}

export default NuevoPassword