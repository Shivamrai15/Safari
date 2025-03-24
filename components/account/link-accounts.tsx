import { Providers } from "./providers";
import { getAccountDetails } from "@/server/account";


const providers = ["google", "github"];

export const LinkAccounts = async() => {
    
    const account = await getAccountDetails();
    
    if (!account) {
        return null;
    }

    const availableProviders = providers.filter((provider)=>!account.accounts.find((oauth)=>oauth.provider===provider));

    return (
        <div className="space-y-10">
            <div className="w-full space-y-4">
                <h2 className="font-semibold select-none">Current Login methods</h2>
                <div className="flex flex-col gap-y-3">
                    {
                        account.accountVerified && (
                           <Providers
                                current
                                provider="email"
                           /> 
                        )
                    }
                    {
                        account.accounts.map((account)=>(
                            <Providers
                                current
                                provider={account.provider}
                                key={account.provider}
                           /> 
                        ))
                    }
                </div>
            </div>
            <div className="w-full space-y-4">
                <h2 className="font-semibold select-none">Available Login methods</h2>
                <div className="flex flex-col gap-y-3">
                    {
                        !account.accountVerified && (
                           <Providers
                                current={false}
                                provider="email"
                           /> 
                        )
                    }
                    {
                        availableProviders.map((account)=>(
                            <Providers
                                current={false}
                                provider={account}
                                key={account}
                           /> 
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
