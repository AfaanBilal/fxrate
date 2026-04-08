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

        const data = await (await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${curL.toLowerCase()}.json`)).json();

        const f = data[curL.toLowerCase()][curR.toLowerCase()];
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
            const data = await (await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d.toISOString().slice(0, 10)}/v1/currencies/${curL.toLowerCase()}.json`)).json();

            chart.push(Number(parseFloat(data[curL.toLowerCase()][curR.toLowerCase()]).toFixed(3)));
        }

        setChartData(chart);
        setChartLoading(false);
    };

    const swapCurrencies = () => {
        const tmpCur = curL;
        const tmpVal = valueL;
        setCurL(curR);
        setCurR(tmpCur);
        setValueL(valueR === '...' ? tmpVal : valueR);
    };

    React.useEffect(() => {
        getFactor();
        getChartData();
    }, [curL, curR]);

    React.useEffect(() => {
        if (!valueL) return;
        setValueR((factor * parseFloat(valueL)).toFixed(2));
    }, [valueL]);

    const getCurrencyLabel = (code: string) => {
        const cur = currencies.find(c => c.code.toUpperCase() === code);
        return cur ? cur.label : code;
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={{ backgroundColor: Colors.DARK, flex: 1 }}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Text style={styles.title}>FxRate</Text>
                    <Text style={styles.subtitle}>Currency Converter</Text>

                    <View style={styles.converterSection}>
                        <Text style={styles.fieldLabel}>From</Text>
                        <View style={styles.inputRow}>
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
                                buttonStyle={styles.dropdownBtnStyle}
                                buttonTextStyle={styles.dropdownBtnTxtStyle}
                                renderDropdownIcon={isOpened => <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} size={36} color={Colors.WHITE} />}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdownStyle}
                                rowStyle={styles.dropdownRowStyle}
                                rowTextStyle={styles.dropdownRowTextStyle}
                                selectedRowStyle={styles.dropdownSelectedRowStyle}
                                search
                                searchInputStyle={styles.dropdownSearchInputStyle}
                                searchPlaceHolder={'Search'}
                                searchPlaceHolderColor={Colors.DARK_GRAY}
                                searchInputTxtColor={Colors.WHITE}
                                renderSearchInputLeftIcon={() => <EvilIcons name="search" size={20} color={Colors.DARK} />}
                            />
                        </View>
                        <Text style={styles.currencyName}>{getCurrencyLabel(curL)}</Text>
                    </View>

                    <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies} activeOpacity={0.7}>
                        <View style={styles.swapIconContainer}>
                            <Feather name="repeat" size={22} color={Colors.WHITE} />
                        </View>
                        <View style={styles.swapLine} />
                    </TouchableOpacity>

                    <View style={styles.converterSection}>
                        <Text style={styles.fieldLabel}>To</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.input, styles.inputResult]}
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
                                buttonStyle={styles.dropdownBtnStyle}
                                buttonTextStyle={styles.dropdownBtnTxtStyle}
                                renderDropdownIcon={isOpened => <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} size={36} color={Colors.WHITE} />}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdownStyle}
                                rowStyle={styles.dropdownRowStyle}
                                rowTextStyle={styles.dropdownRowTextStyle}
                                selectedRowStyle={styles.dropdownSelectedRowStyle}
                                search
                                searchInputStyle={styles.dropdownSearchInputStyle}
                                searchPlaceHolder={'Search'}
                                searchPlaceHolderColor={Colors.DARK_GRAY}
                                searchInputTxtColor={Colors.WHITE}
                                renderSearchInputLeftIcon={() => <EvilIcons name="search" size={20} color={Colors.DARK} />}
                            />
                        </View>
                        <Text style={styles.currencyName}>{getCurrencyLabel(curR)}</Text>
                    </View>

                    {factor > 0 && (
                        <Text style={styles.rateText}>
                            1 {curL} = {factor.toFixed(4)} {curR}
                        </Text>
                    )}
                </View>

                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.chartTitle}>Trend</Text>
                            <Text style={styles.chartSubtitle}>Last 5 days</Text>
                        </View>
                        <View style={styles.chartBadge}>
                            <Text style={styles.chartBadgeText}>
                                {curL} / {curR}
                            </Text>
                        </View>
                    </View>
                    {chartLoading ?
                        <View style={styles.chartPlaceholder}>
                            <ActivityIndicator size="large" color={Colors.RED} />
                        </View> :
                        <View style={styles.chartContainer}>
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
                                svg={{ stroke: Colors.RED, strokeWidth: 2.5 }}>
                                <Grid svg={{ stroke: Colors.GRID }} />
                            </LineChart>
                        </View>
                    }
                    {date &&
                        <Text style={styles.updatedText}>
                            Updated <Text style={{ color: Colors.RED }}>{date}</Text>
                        </Text>
                    }
                </View>

                <View style={styles.copyrightBox}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://afaan.dev')}>
                        <Text style={styles.copyrightText}>
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
        gap: 24,
    },
    topBox: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        backgroundColor: Colors.DARK_LIGHTER,
        borderRadius: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,

        elevation: 8,
    },
    title: {
        height: 60,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: Fonts.Borel,
        color: Colors.RED,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: Fonts.SourceSansPro,
        color: Colors.MID_GRAY,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    converterSection: {
        gap: 4,
    },
    fieldLabel: {
        fontFamily: Fonts.SourceSansProSemiBold,
        fontSize: 12,
        color: Colors.DARK_GRAY,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        paddingLeft: 24,
        marginBottom: 4,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    input: {
        width: 150,
        height: 72,
        padding: 8,
        fontSize: 36,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.GRID,
        backgroundColor: Colors.INPUT_BLACK,
        color: Colors.WHITE,
        fontFamily: Fonts.Ubuntu,
    },
    inputResult: {
        borderColor: Colors.RED,
        color: Colors.RED,
    },
    currencyName: {
        fontFamily: Fonts.SourceSansProLight,
        fontSize: 12,
        color: Colors.MID_GRAY,
        textAlign: 'center',
    },
    swapButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        flexDirection: 'row',
    },
    swapIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.RED,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    swapLine: {
        position: 'absolute',
        left: 40,
        right: 40,
        height: 1,
        backgroundColor: Colors.GRID,
    },
    rateText: {
        textAlign: 'center',
        fontFamily: Fonts.UbuntuMedium,
        fontSize: 14,
        color: Colors.DARK_GRAY,
        marginTop: 12,
    },
    chartSection: {
        paddingHorizontal: 24,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    chartTitle: {
        fontSize: 20,
        color: Colors.WHITE,
        fontFamily: Fonts.UbuntuMedium,
    },
    chartSubtitle: {
        fontSize: 13,
        color: Colors.DARK_GRAY,
        fontFamily: Fonts.SourceSansPro,
    },
    chartBadge: {
        backgroundColor: Colors.RED_MUTED,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    chartBadgeText: {
        fontSize: 13,
        color: Colors.RED,
        fontFamily: Fonts.UbuntuMedium,
    },
    chartPlaceholder: {
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        height: 180,
        flexDirection: 'row',
    },
    updatedText: {
        paddingTop: 16,
        fontFamily: Fonts.Ubuntu,
        fontSize: 13,
        textAlign: 'center',
        color: Colors.DARK_GRAY,
    },
    copyrightBox: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 16,
    },
    copyrightText: {
        fontFamily: Fonts.Ubuntu,
        fontSize: 13,
        color: Colors.MID_GRAY,
    },
    dropdownBtnStyle: {
        width: 150,
        height: 72,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.GRID,
        backgroundColor: Colors.INPUT_BLACK,
        fontFamily: Fonts.Ubuntu,
    },
    dropdownBtnTxtStyle: {
        color: Colors.WHITE,
        fontSize: 28,
        fontFamily: Fonts.Ubuntu,
    },
    dropdownStyle: {
        backgroundColor: Colors.INPUT_BLACK,
        borderRadius: 12,
    },
    dropdownRowStyle: {
        backgroundColor: Colors.INPUT_BLACK,
        borderBottomWidth: 0,
    },
    dropdownRowTextStyle: {
        color: Colors.WHITE,
    },
    dropdownSelectedRowStyle: {
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
    },
    dropdownSearchInputStyle: {
        fontSize: 28,
        borderBottomWidth: 1,
        borderBottomColor: Colors.DARK,
        backgroundColor: Colors.INPUT_BLACK,
        color: Colors.WHITE,
    },
});
