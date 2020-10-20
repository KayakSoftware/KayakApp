import React from "react";
import { View, Text} from "react-native";

const TripOverviewScreen = ({ route, navigation }) => {

    const { userId } = route.params;

    const render = () => {
        return <View>
            <Text>
                Find trip with Id: {JSON.stringify(userId)}
            </Text>
        </View>
    }

    return render();
}

export default TripOverviewScreen;