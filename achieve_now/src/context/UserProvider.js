// import React, { Component, createContext } from "react";
import {
    auth,
    generateCoachDocument,
    generateParentDocument,
    generateUserDocument,
} from "../firebase";
import firebase from "firebase/app";

// export const UserContext = createContext({ user: null });

// export const UserProvider =()=> {
// const [state,setState] = React.useState();
// React.useEffect(()=>{

//   auth.onAuthStateChanged(async (userAuth) => {
//     const filteredRoleName = userAuth?.displayName?.substring(
//       userAuth.displayName.indexOf("-") + 1
//     );
//     // if (userAuth && filteredRoleName) {
//     switch (filteredRoleName) {
//       case "coach":
//         const coach = await generateCoachDocument(userAuth);
//         this.setState({ coach });
//         break;
//       //coach component
//       case "teacher":
//         const teacher = await generateUserDocument(userAuth);
//         this.setState({ teacher });
//         break;
//       // teach comp
//       case "parent":
//         const parent = await generateParentDocument(userAuth);
//         this.setState({ parent });
//         break;
//       default:
//         this.setState(null);
//       // parent comp
//     }
// })

//   return  (
//       <UserContext.Provider value={state.user}>
//         {this.props.children}
//       </UserContext.Provider>)

// }

// export default UserProvider;
import React, { Component } from 'react'

const UserContext = React.createContext()

class UserProvider extends Component {
    // Context state
    state = {
        user: {},
    }

    // Method to update state
    setUser = (user) => {
        this.setState((prevState) => ({ user }))
    }
    componentDidMount = async () => {
        auth.onAuthStateChanged(async (userAuth) => {
            const filteredRoleName = userAuth?.displayName?.substring(
                userAuth.displayName.indexOf("-") + 1
            );
            if (userAuth && filteredRoleName) {
                switch (filteredRoleName) {
                    case "coach":
                        const coach = await generateCoachDocument(userAuth);
                        this.setState({ coach });
                        break;
                    //coach component
                    case "teacher":
                        const teacher = await generateUserDocument(userAuth);
                        this.setState({ teacher });
                        break;
                    // teach comp
                    case "parent":
                        const parent = await generateParentDocument(userAuth);
                        this.setState({ parent });
                        break;
                    default:
                        this.setState(null);
                    // parent comp
                }
            }
        })
    }
    render() {
        const { children } = this.props
        const { user } = this.state
        const { setUser } = this

        return (
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                }}
            >
                {children}
            </UserContext.Provider>
        )
    }
}

export default UserContext

export { UserProvider }
