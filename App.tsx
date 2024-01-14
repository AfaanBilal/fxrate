/**
 * FxRate
 *
 * @author Afaan Bilal
 * @link   https://afaan.dev
 *
 * @copyright 2024 Afaan Bilal
 */

import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { Fonts } from './src/utils/fonts';
import { Colors } from './src/utils/colors';
import currencies from './src/utils/currencies';

export default function App() {
    const [fontsLoaded] = useFonts({
        [Fonts.SourceSansProLight]: require('./assets/fonts/Source_Sans_Pro/SourceSansPro-Light.ttf'),
        [Fonts.SourceSansPro]: require('./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf'),
        [Fonts.SourceSansProSemiBold]: require('./assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf'),
        [Fonts.SourceSansProBold]: require('./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf'),

        [Fonts.UbuntuLight]: require('./assets/fonts/Ubuntu/Ubuntu-Light.ttf'),
        [Fonts.Ubuntu]: require('./assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
        [Fonts.UbuntuMedium]: require('./assets/fonts/Ubuntu/Ubuntu-Medium.ttf'),
        [Fonts.UbuntuBold]: require('./assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),

        [Fonts.Borel]: require('./assets/fonts/Borel/Borel-Regular.ttf'),
    });

    const [valueL, setValueL] = React.useState('1');
    const [curL, setCurL] = React.useState('USD');

    const [valueR, setValueR] = React.useState('');
    const [curR, setCurR] = React.useState('INR');

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={{ backgroundColor: Colors.DARK, flex: 1 }}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={{ paddingTop: 24, alignItems: 'center' }}>
                    <Text style={{ fontSize: 48, fontFamily: Fonts.Borel, color: Colors.RED }}>FxRate</Text>
                </View>
                <View style={{ borderBottomColor: Colors.RED, borderBottomWidth: 1, marginHorizontal: 32 }}></View>
                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', paddingTop: 24 }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={v => setValueL(v)}
                        value={valueL}
                        placeholder={curL}
                        placeholderTextColor={Colors.DARK_GRAY}
                        keyboardType="numeric"
                    />
                    <SelectDropdown
                        data={currencies}
                        defaultValue={curL}
                        defaultButtonText={curL}
                        onSelect={(selectedItem, index) => { setCurL(selectedItem.code.toUpperCase()); }}
                        buttonTextAfterSelection={(selectedItem, index) => selectedItem.code.toUpperCase()}
                        rowTextForSelection={(item, index) => item.code.toUpperCase()}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        renderDropdownIcon={isOpened => <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} size={36} color={Colors.WHITE} />}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTextStyle}
                        selectedRowStyle={styles.dropdown1SelectedRowStyle}
                        search
                        searchInputStyle={styles.dropdown1searchInputStyle}
                        searchPlaceHolder={'Search'}
                        searchPlaceHolderColor={Colors.DARK_GRAY}
                        searchInputTxtColor={Colors.WHITE}
                        renderSearchInputLeftIcon={() => <EvilIcons name="search" size={20} color={Colors.DARK} />}
                    />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <FontAwesome5 name="equals" size={64} color={Colors.RED} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', paddingBottom: 24 }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={v => setValueR(v)}
                        value={valueR}
                        placeholder={curR}
                        placeholderTextColor={Colors.DARK_GRAY}
                        keyboardType="numeric"
                    />
                    <SelectDropdown
                        data={currencies}
                        defaultValue={curR}
                        defaultButtonText={curR}
                        onSelect={(selectedItem, index) => { setCurR(selectedItem.code.toUpperCase()); }}
                        buttonTextAfterSelection={(selectedItem, index) => selectedItem.code.toUpperCase()}
                        rowTextForSelection={(item, index) => item.code.toUpperCase()}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        renderDropdownIcon={isOpened => <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} size={36} color={Colors.WHITE} />}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTextStyle}
                        selectedRowStyle={styles.dropdown1SelectedRowStyle}
                        search
                        searchInputStyle={styles.dropdown1searchInputStyle}
                        searchPlaceHolder={'Search'}
                        searchPlaceHolderColor={Colors.DARK_GRAY}
                        searchInputTxtColor={Colors.WHITE}
                        renderSearchInputLeftIcon={() => <EvilIcons name="search" size={20} color={Colors.DARK} />}
                    />
                </View>
                <View style={{ borderBottomColor: Colors.RED, borderBottomWidth: 1, marginHorizontal: 32 }}></View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: Fonts.Ubuntu, fontSize: 18, color: Colors.DARK_GRAY }}>
                        &copy; Afaan Bilal (afaan.dev)
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 32,
    },
    input: {
        width: 150,
        height: 80,
        padding: 8,
        fontSize: 40,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.DARK_GRAY,
        backgroundColor: Colors.BLACK,
        color: Colors.WHITE,
        fontFamily: Fonts.Ubuntu,
    },
    dropdown1BtnStyle: {
        width: 150,
        height: 80,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.DARK_GRAY,
        backgroundColor: Colors.BLACK,
        fontFamily: Fonts.Ubuntu,
    },
    dropdown1BtnTxtStyle: {
        color: Colors.WHITE,
        fontSize: 32,
    },
    dropdown1DropdownStyle: {
        backgroundColor: Colors.BLACK,
        borderRadius: 12,
    },
    dropdown1RowStyle: {
        backgroundColor: Colors.BLACK,
        borderBottomWidth: 0,
    },
    dropdown1RowTextStyle: {
        color: Colors.WHITE,
    },
    dropdown1SelectedRowStyle: {
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    dropdown1searchInputStyle: {
        fontSize: 32,
        borderBottomWidth: 1,
        borderBottomColor: Colors.DARK,
        backgroundColor: Colors.BLACK,
        color: Colors.WHITE,
    },
});
