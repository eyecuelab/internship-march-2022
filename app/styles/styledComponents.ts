import styled from "styled-components"

// font-family: 'Lato', sans-serif;
// font-family: 'Playfair Display', serif;

export const MainBtn = styled.button`
  width: 276.07px;
  height: 56px;
  left: 46.84px;
  top: 683.4px;
  background: #cad2c5;
  border-radius: 15px;
`

export const ClearBtn = styled(MainBtn)`
  box-sizing: border-box;
  background: rgba(202, 210, 197, 0);
  font-family: "Lato", sans-serif;
  color: #ffffff;
`
export const SmMainBtn = styled(MainBtn)`
  width: 153px;
  height: 56px;
`
export const SmClearBtn = styled(ClearBtn)`
  width: 153px;
  height: 56px;
  color: #ffffff;
`

export const Header = styled.h1`
  font-family: "Playfair Display";
  font-size: 2em;
  margin-top: 1em;
  margin-left: 1em;
  color: #ffffff;
`

export const SubHeader = styled.h2`
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  color: #ffffff;
`
export const InputLabel = styled.label`
  font-size: 1.3em;
  font-weight: bold;
  color: #ffffff;
`
export const InputField = styled.input`
  width: 315px;
  height: 55px;
  color: black;
  padding .5em;
  border-radius: 15px;
  margin-top: 10em
`
export const RoundedRectangle = styled.div`
  max-width: 600px;
  height: max-content;
  margin: auto;
  margin-top: 1em;
  background: #52796f;
  border-radius: 13px;
  color: #ffffff;
  padding: 2em;
  font-size: 0.5em;
`
export const CostText = styled.text`
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  text-align: right;
  color: #ffffff;
`
export const ErrorDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
`
