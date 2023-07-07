import { StyleSheet, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRecoilValue } from 'recoil';
import { isManager } from '../atoms/User';

const LoginScreen = () => {
  const manager = useRecoilValue(isManager)

  useEffect(() => {
    const func = async () => {
      const res = await fetch('http://192.168.29.234:5000/')
      const message = await res.json()
      console.log(message)
    }
    func()
  }, [])

  return (
    <SafeAreaView>
      <Text>LoginScreen</Text>
      <Text>{manager ? 'true' : 'false'}</Text>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})