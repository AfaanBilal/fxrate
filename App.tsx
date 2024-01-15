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
import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

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

    const [valueR, setValueR] = React.useState('...');
    const [curR, setCurR] = React.useState('INR');

    const [date, setDate] = React.useState('');
    const [factor, setFactor] = React.useState(0);

    const [chartData, setChartData] = React.useState<Array<number>>([]);
    const [chartLoading, setChartLoading] = React.useState(true);

    const getFactor = async () => {
        setValueR('...');

        const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${curL.toLowerCase()}/${curR.toLowerCase()}.json`)).json();

        const f = data[curR.toLowerCase()];
        setDate(new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
        setFactor(f);

        setValueR((f * parseFloat(valueL)).toFixed(2));
    };

    const getChartData = async () => {
        setChartLoading(true);

        const chart = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${d.toISOString().slice(0, 10)}/currencies/${curL.toLowerCase()}/${curR.toLowerCase()}.json`)).json();

            chart.push(Number(parseFloat(data[curR.toLowerCase()]).toFixed(3)));
        }

        setChartData(chart);
        setChartLoading(false);
    };

    React.useEffect(() => {
        getFactor();
        getChartData();
    }, [curL, curR]);

    React.useEffect(() => {
        if (!valueL) return;
        setValueR((factor * parseFloat(valueL)).toFixed(2));
    }, [valueL]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={{ backgroundColor: Colors.DARK, flex: 1 }}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Text style={styles.title}>FxRate</Text>
                    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={v => setValueL(v)}
                            value={valueL}
                            placeholder={curL}
                            placeholderTextColor={Colors.DARK_GRAY}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                        <SelectDropdown
                            data={currencies}
                            defaultValue={curL}
                            defaultButtonText={curL}
                            onSelect={(selectedItem, index) => setCurL(selectedItem.code.toUpperCase())}
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
                        <Feather name="arrow-down" size={56} color={Colors.RED} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', paddingBottom: 12 }}>
                        <TextInput
                            style={{ ...styles.input, borderColor: Colors.RED, color: Colors.RED }}
                            value={valueR}
                            placeholder={curR}
                            placeholderTextColor={Colors.RED}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                        <SelectDropdown
                            data={currencies}
                            defaultValue={curR}
                            defaultButtonText={curR}
                            onSelect={(selectedItem, index) => setCurR(selectedItem.code.toUpperCase())}
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
                </View>
                <View style={{ paddingHorizontal: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Text style={{ fontSize: 18, color: Colors.RED, fontFamily: Fonts.SourceSansPro }}>Last 5 days</Text>
                        <Text style={{ fontSize: 14, color: Colors.DARK_GRAY, fontFamily: Fonts.SourceSansPro }}>
                            1
                            <Text style={{ color: Colors.RED }}> {curL} </Text>
                            vs
                            <Text style={{ color: Colors.RED }}> {curR}</Text>
                        </Text>
                    </View>
                    {chartLoading ?
                        <View style={{ height: 180, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color={Colors.RED} />
                        </View> :
                        <View style={{ height: 180, flexDirection: 'row' }}>
                            <YAxis
                                data={chartData}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                    fill: Colors.DARK_GRAY,
                                    fontSize: 10,
                                }}
                                numberOfTicks={5}
                                formatLabel={(value) => ` ${value} `}
                            />
                            <LineChart
                                style={{ height: 180, flex: 1, marginLeft: 16 }}
                                data={chartData}
                                contentInset={{ top: 20, bottom: 20 }}
                                curve={shape.curveBasis}
                                svg={{ stroke: Colors.RED }}>
                                <Grid svg={{ stroke: Colors.GRID }} />
                            </LineChart>
                        </View>
                    }
                    {date &&
                        <Text style={styles.updatedText}>
                            Updated as of <Text style={{ color: Colors.RED }}> {date}</Text>
                        </Text>
                    }
                </View>
                <View style={styles.copyrightBox}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://afaan.dev')}>
                        <Text style={{ fontFamily: Fonts.Ubuntu, fontSize: 14, color: Colors.DARK_GRAY }}>
                            &copy; Afaan Bilal (afaan.dev)
                        </Text>
                    </TouchableOpacity>
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
    topBox: {
        paddingVertical: 16,
        marginHorizontal: 16,
        backgroundColor: Colors.DARK,
        borderRadius: 8,

        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,

        gap: 12,
    },
    title: {
        height: 60,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: Fonts.Borel,
        color: Colors.RED,
    },
    input: {
        width: 150,
        height: 80,
        padding: 8,
        fontSize: 40,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.GRID,
        backgroundColor: Colors.INPUT_BLACK,
        color: Colors.WHITE,
        fontFamily: Fonts.Ubuntu,
    },
    dropdown1BtnStyle: {
        width: 150,
        height: 80,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.GRID,
        backgroundColor: Colors.INPUT_BLACK,
        fontFamily: Fonts.Ubuntu,
    },
    dropdown1BtnTxtStyle: {
        color: Colors.WHITE,
        fontSize: 32,
        fontFamily: Fonts.Ubuntu,
    },
    dropdown1DropdownStyle: {
        backgroundColor: Colors.INPUT_BLACK,
        borderRadius: 12,
    },
    dropdown1RowStyle: {
        backgroundColor: Colors.INPUT_BLACK,
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
        backgroundColor: Colors.INPUT_BLACK,
        color: Colors.WHITE,
    },
    updatedText: {
        paddingTop: 24,
        fontFamily: Fonts.Ubuntu,
        fontSize: 16,
        textAlign: 'center',
        color: Colors.DARK_GRAY
    },
    copyrightBox: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 16,
    },
});
