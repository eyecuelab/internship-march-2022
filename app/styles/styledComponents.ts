import styled from "styled-components"

// font-family: 'Lato', sans-serif;
// font-family: 'Playfair Display', serif;

export const MainBtn = styled.button`
  border: 1px solid #cad2c5;
  background: #cad2c5;
  color: #2f3e46;
  border-radius: 15px;
  padding: 12px 32px;
  font-size: 1.5em;
  font-weight: bold;
  line-height: 1em;
  text-align: center;
  width: 315px;
  height: 56px;
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
  font-family: 'Playfair Display', serif;
  font-size: 2em;
  margin-top: 1em;
  margin-left: 1em;
  color: #ffffff;
`
export const InputLabel = styled.label`
  font-size: 1.3em;
  font-weight: bold;
  color: #ffffff;
  margin-left: -10em;
`
export const InputField = styled.input`
  width: 315px;
  height: 55px;
  color: black;
  padding .5em;
  border-radius: 15px;
  margin-top: .3em
`
export const ErrorDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
`