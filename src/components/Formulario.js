import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import Axios from "axios";
import Error from "./Error";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  // state del listado de criptomonedas
  const [listacripto, guardarCriptomonedas] = useState([]);
  const [error, guardarError] = useState(false);

  const monedas = [
    { codigo: "USD", nombre: "Dolar de Estados Unidos" },
    { codigo: "ARS", nombre: "Peso Argentino" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
  ];
  // usando useMoneda
  const [moneda, SelectMonedas] = useMoneda("Elige tu moneda", "", monedas);

  // usando useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige tu criptomoneda",
    "",
    listacripto
  );

  // ejecutar llamado a la api
  useEffect(() => {
    const consultarAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
      const resultado = await Axios.get(url);
      guardarCriptomonedas(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  // submit
  const cotizarMoneda = (e) => {
    e.preventDefault();

    // validando campos
    if (moneda === "" || criptomoneda === "") {
      guardarError(true);
      return;
    }

    // datos al componente principal
    guardarError(false);
    guardarMoneda(moneda);
    guardarCriptomoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCripto />
      <Boton type="submit" value="Calcular" />
    </form>
  );
};

export default Formulario;
