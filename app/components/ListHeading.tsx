import { styled } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";

const Heading = styled(Text);

const ListHeading = ({ title }: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Heading className="list-title">{title}</Heading>
      <TouchableOpacity className="list-action">
        <Text className="list-action-text">View all</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ListHeading;
