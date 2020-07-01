import React, { useState } from 'react';
import { TextInput } from 'react-native';

interface InputInterface {
  isPwd?: boolean;
  style?: Object;
  onChange: Function;
}

const Input = ({ isPwd, style, onChange, ...rest }: InputInterface): React.ReactElement => {
  const [borderColor, setBorderColor] = useState('#E4E6E6');

  const onFocus = () => {
    setBorderColor('#181B1B');
  }

  const onBlur= () => {
    setBorderColor('#E4E6E6');
  }

  return (
    <TextInput
      onChangeText={text => onChange(text)}
      style={[
        {
          height: 56,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          borderColor: borderColor,
          borderWidth: 1,
          paddingLeft: 16,
          fontSize: 16
        },
        style,
      ]} 
      onFocus={onFocus} 
      onBlur={onBlur} 
      underlineColorAndroid='transparent'
      secureTextEntry={isPwd}
      {...rest}
    />
  )
}

export default Input;
