import { Divider, Searchbar } from 'react-native-paper';
import React,{useEffect,useState} from "react";
import { FlatList, Text, TouchableOpacity, View, SafeAreaView, Dimensions, BackHandler, Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

function SearchBarSuggest(props) {


    const Item = ({ carpark }) => (
        <TouchableOpacity 
            style={{ padding: 10,paddingLeft:55 }}
            onPress={()=>props.pressSuggestion(carpark)}
        >
            <Text style={{textTransform:'capitalize'}}>{carpark.CarparkID.toLowerCase()}</Text>
        </TouchableOpacity>
    );
    // props.pressSuggestion(name)
    const renderItem = ({ item }) => (
        <Item carpark={item.item} />
    );

    const [showSuggestions,setShowSuggestions] = useState(false)

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    
        // cleanup function
        return () => {
          Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
          Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
      }, []);

      const _keyboardDidShow = () => {
        // alert("Keyboard Shown");
        setShowSuggestions(true)
      };
    
      const _keyboardDidHide = () => {
        setShowSuggestions(false)
      };
    

    var { width, height } = Dimensions.get('window');
    // console.log(props.suggestions)

    const renderItemSeparator = () => <Divider />

    return (
        
        <View style={{ flex: 1,width:width-20, zIndex: 100, position: 'absolute', marginTop: 50,marginHorizontal:10}}>
            <View >
                <Searchbar
                    onFocus={()=> setShowSuggestions(true)}
                    onBlur={()=> setShowSuggestions(false)}
                    style={{borderRadius: 50 }}
                    placeholder="Search"
                    onChangeText={props.onChangeText}
                    value={props.value}
                    onSubmitEditing={(event) => props.onSubmit(event.nativeEvent.text)}
                />
            </View>

            <SafeAreaView>
                {props.suggestions.length > 0 && showSuggestions &&
                    <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        style={{backgroundColor: 'rgba(255, 255, 255, 0.8)',borderBottomRightRadius:20,borderBottomLeftRadius:20}}
                        data={props.suggestions}
                        renderItem={renderItem}
                        keyExtractor={item => item.item.CarparkID}
                        ItemSeparatorComponent={renderItemSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    />
                }
            </SafeAreaView>
        </View>
    )
}

export default SearchBarSuggest