import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useRecoilState } from 'recoil'
import { sessionToken } from '../atoms/User'

const HomeScreen = () => {
  const [token, setToken] = useRecoilState(sessionToken)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>HomeScreen</Text>
      <Text onPress={() => setToken(null)}>Logout</Text>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})