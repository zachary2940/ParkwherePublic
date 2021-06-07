import React from "react";
import {
    useTheme,
    Title,
    Avatar,
    Surface,
    Subheading
} from 'react-native-paper'
import styles from "../styles/ListStyles"
import {
    View,
    TouchableOpacity
} from "react-native";


function CarparkListItem(props) {
    const { colors } = useTheme();


    return (
        <TouchableOpacity
            onPress={() => props.getCurrentItemInfo(props.carpark)}
            style={styles.surfaceContainer}
        >
            <Surface style={styles.surface}>
                <View style={styles.infoContainer}>
                    <View style={styles.sectionContainer}>
                        {/* <Avatar.Image style={styles.avatar} size={28} source={{ uri: image && image }} /> */}
                        <Title
                            numberOfLines={1}
                            style={styles.coinName}
                        >
                            {props.carpark.CarparkID}
                        </Title>

                    </View>
                    <View style={styles.sectionContainer}>
                        {props.carpark.Distance &&
                            <Subheading
                                numberOfLines={1}
                                style={{ color: colors.primary }}
                            >
                                Distance: {props.carpark.Distance}km
                            </Subheading>
                        }
                    </View>
                    <View style={styles.sectionContainer}>
                        <Subheading
                            numberOfLines={1}
                            style={{ color: colors.primary }}
                        >
                            Available Lots: {props.carpark.AvailableLots}
                        </Subheading>
                    </View>
                </View>
                {props.delete ? <TouchableOpacity hitSlop={{ x: 10, y: 10 }} onPress={() => props.handleDelete(props.carpark.CarparkID)}>
                    <Avatar.Icon
                        size={28}
                        icon="trash-can"
                    />
                </TouchableOpacity> : null}
            </Surface>
        </TouchableOpacity>
    );
}

export default CarparkListItem = React.memo(CarparkListItem);
