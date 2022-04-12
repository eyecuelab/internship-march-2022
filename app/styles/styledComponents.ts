import styled from "styled-components"

// font-family: 'Lato', sans-serif;
// font-family: 'Playfair Display', serif;

export const MainBtn = styled.button`
  border: 1px solid #cad2c5;
  background: #cad2c5;
  color: #2f3e46;
  font-family: "Lato", sans-serif;
  border-radius: 15px;
  padding: 12px 32px;
  font-size: 12px;
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

// .button {
//   background-color: #4CAF50; /* Green */
//   border: none;
//   color: white;
//   padding: 15px 32px;
//   font-size: 16px;
//   text-align: center;
//   text-decoration: none;
//   display: inline-block;
// }
