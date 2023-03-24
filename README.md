
# Bjob-client

Simple SSG client for JobOfferFactory smart contract based on NextJS and Web3JS

More info about smart contract here 
https://github.com/VladNagibin/bjob-server


## FAQ

#### How to create Job offer?

    1)Choose "I am employer" on main screen
    2)Fund JobOfferFactory on some amount of ETH
    3)Click create
    4)Set your settings and click "Create job offer"

#### What settings I can set to job offer?

    1)Amount - payment amount that is going to be paid to the employee
    2)Address - employee's address
    3)Currency - in which currency amount is set. 
    payment will go in native currency of chain but if you choose USD or EUR, 
    each payment is going to be counted by the currency/native currency rate
    4)Payment rate - number of days that should be passed between payments
    5)Contract type - can be hourly or salary. 
    Salary - each payment equals amount. 
    Hourly - each payment equals worked hours * amount
    6)Keeper compatible - if true, each month system will check
    if your contract requires payment and will do that automatically

#### How to accept job offer?
    1)Choose "I am employee" on the main screen
    2)Find and open job offer
    3)Click sign

#### How to receive payment from job offer?
##### Salary Contract
    1)Payment should be provided by employer 
    so open job offer as employer
    2)Click pay
##### Hourly Contract
    1)Payment should be provided by employee 
    so open job offer as employee
    2)Enter your worked hours
    3)Click add worked hours
    4)Click pay worked hours




## Demo

Smart contract deployed on Mumbai, Sepolia and Goerli testnets
and use Metamask as provider so you can play with it here 
https://bjob.on.fleek.co/

### IPFS 
hash
QmURCM1viUXsfQmJ41NwW7kZweBxBXPK9yrNPgTzKvfvw5

to run on IPFS
https://ipfs.io/ipfs/QmURCM1viUXsfQmJ41NwW7kZweBxBXPK9yrNPgTzKvfvw5

