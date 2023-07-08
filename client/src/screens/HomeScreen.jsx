import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useRecoilState } from 'recoil'
import { sessionToken, admin, number } from '../atoms/User'

const HomeScreen = () => {
  const [token, setToken] = useRecoilState(sessionToken)
  const [isAdmin, setIsAdmin] = useRecoilState(admin);
  const [phone, setPhone] = useRecoilState(number);

  const logout = () => {
    setToken(null)
    setIsAdmin(false)
    setPhone(null)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>HomeScreen</Text>
      <Text onPress={logout}>Logout</Text>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})