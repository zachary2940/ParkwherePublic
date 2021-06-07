import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    infoContainer: {
        flexGrow: 1,
        width: '80%',
    },
    surfaceContainer: {
        flex:1,
        width: '100%',
    },
    surface: {
        width: '100%',
        paddingVertical: 8,
        alignItems: 'center',
        flexDirection: 'row',
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    avatar: {
        marginHorizontal: 8,
    },
    coinName: {
        textTransform: 'capitalize',
    }, flatListContainer: {
        width: '100%',
        paddingVertical: 16,
    },
})