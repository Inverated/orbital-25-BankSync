## Milestone 1 Submission


## Team name: 

BankSync


## Proposed Level of Achievement:

Project Apollo 11


## Motivation

Many individuals manage their finances across a wide range of financial institutions, including traditional banks, like OCBC, DBS/POSB, and UOB, as well as various credit cards, such as Revolut and YouTrip, and digital payment platforms, such as Google Pay, Apple Pay, GrabPay, and PayLah. This is usually because individuals want to leverage the unique services of each institution, helping them achieve greater convenience, reduce risk, or potentially increase returns.

With each account operating in its own ecosystem, users are often left juggling multiple apps, platforms, and statements to get a complete picture of their financial health. This fragmentation can make budgeting, expense tracking and savings management tedious and time-consuming. Although there are tools and apps that attempt to aggregate financial data, they are not always comprehensive, compatible with all institutions, or easy to use. As a result, many people still rely on manual tracking methods, such as spreadsheets or mental estimates, which can lead to inaccuracies and inefficiencies. The lack of real-time, consolidated visibility makes it easier to lose track of spending and overlook opportunities to save. In the long run, this can hinder effective financial planning and increase the risk of overspending or falling short on savings goals.


## Vision

We hope to provide users with an intuitive and user-friendly web application that consolidates and organizes monthly bank statements from multiple financial institutions, such as OCBC, DBS/POSB and UOB. This will enable users to track their spending, monitor account balances, and gain financial insights more effectively across multiple accounts, ultimately helping them uncover opportunities to save. Our goal is to empower individuals with the tools they need to take control of their finances without the stress of logging into multiple apps or manually tracking expenses across different platforms.


## User Story



1. As a bank account holder who wants to track my expenses across different banks, I want to be able to view all my monthly statements in one place.
2. As a user who wants to understand my financial behavior, I want to see visual charts of my spending and saving trends over time.
3. As a user who needs financial insights to more effectively manage my finances, I want to receive categorized spending reports and trend analyses.
4. As a taxpayer, I want to export income and expenses data by category and month for accounting purposes.
5. As a user who frequently downloads statements, I want to be able to export my data in multiple formats (PDF, CSV, etc.).
6. As a user switching banks for the best interest rates, I want to import past bank statements from older institutions so I don’t lose past financial data.


## Scope of Project

Our web application will allow users to upload their monthly bank statements from the major local banks including OCBC, DBS/POSB, and UOB. The platform will then present a unified comprehensive view of their financial activity by combining the bank statements. It will automatically categorize expenses and provide visual dashboards that break down spending habits over time, alongside comparisons to user’s income. Users will be able to monitor their account balances and track income and expenditure by category. In addition, users will be able to export these data to PDF or Excel, enabling users to maintain local financial records for accounting purposes, easy offline access or sharing. 


## Features


### Registration 

<span style="text-decoration:underline;">[Proposed]</span>

We plan to implement a user authentication system that allows users to switch between login and signup views. Secure authentication methods such as email and password, as well as third-party login with Google and GitHub, will also be implemented to ensure data security and user privacy.

<span style="text-decoration:underline;">[Current Progress]</span>

Currently, our *Registration* page supports both login and signup using email and password. Unauthorized access to the dashboard is handled with a secure redirection to the *Registration* page. If the user has a valid session, they will automatically be redirected to their data, ensuring a smoother user experience.



<span style="text-decoration:underline;">[Additional Features]</span>



1. “Keep me signed in” Option
* Users have the option to stay signed in even after closing the browser or leaving the site. This enhances convenience by reducing the need for repeated logins during active use.


### Dashboard

<span style="text-decoration:underline;">[Proposed]</span>

Our product aims to combine monthly bank statements from multiple financial institutions into a unified dashboard, eliminating the need to switch between multiple banking platforms. Users will be able to upload their monthly bank statements to our web application, which automatically extract, process, and convert the data into a standardized format, regardless of the original bank layout. The dashboard will support tabbed navigation, allowing users to easily switch between different views of their financial data. In addition, we plan on implementing a profile and settings menu to allow users to customise the interface, making the application more user-friendly and personalised

<span style="text-decoration:underline;">[Current Progress]</span>

The current application includes function tabs including *Overview*, *Accounts*, *Transactions* and *Analytics*, offering users a clear and comprehensive view of their financial data. Users are also able to sign out from the application, ensuring their data remains protected when the application is not in use.

<span style="text-decoration:underline;">[Additional Features]</span>



1. Mobile View
* With the implementation of a compact UI layout, users are able to use the web application on their mobile devices, enhancing usability across different screen sizes.


### Overview

<span style="text-decoration:underline;">[Proposed]</span>

Users will be able to view their total balance, income and expenses aggregated from all the monthly bank statements that they upload. The *Overview* page will also summarise the balance, income and expenses for each individual account. Thus, offering both a consolidated and account-specific view at a glance.

<span style="text-decoration:underline;">[Current Progress]</span>

The current *Overview *page displays the total balance, overall income and total expenses across all accounts. Users can also click on *Total Balance* to see a breakdown of the balance by individual amount, giving users more detailed insight into their financial distribution. 



<span style="text-decoration:underline;">[Additional Features]</span>



1. Custom Account Display
* Users will be able to select specific accounts to be shown on the *Overview *page, allowing users to have a quick look of frequently used or important accounts.


### Accounts

<span style="text-decoration:underline;">[Proposed]</span>

Our proposed *Accounts* page will allow users to view detailed bank information organized by account. This includes the financial institution, account name, account balance, and associated transactions over the past month. The goal of this page is to offer a one-stop platform where users can access and understand their financial data across multiple banks, eliminating the hassle of logging into multiple banking apps and manually piecing information together.

<span style="text-decoration:underline;">[Current Progress]</span>

The current implementation of the *Accounts* page displays the key details such as the financial institution, account name, account number, and current balance for each account. Users can also click on *All Transactions* to view the full transaction history associated with a specific bank account, providing a clear and accessible overview.

<span style="text-decoration:underline;">[Additional Features]</span>



1. Account Categorization
* Users will be able to tag each account (e.g. “Savings”, “Investment”) to better organize and differentiate account purposes, making financial tracking more intuitive.
2. Data Range Filtering
* Instead of always displaying the full transaction history of each bank account, which can lead to loading issues over time due to the growing volume of data, users will be able to select custom date ranges. This allows for more focused analysis, such as monthly budgeting or quarterly reviews.


### Transactions

<span style="text-decoration:underline;">[Proposed]</span>

Our proposed *Transactions* page will display a consolidated list of transaction history from multiple accounts, allowing users to view their financial activity in one place without needing to switch between multiple banking apps or downloaded bank statements. Users will be able to amend transaction categories or create their own customised category to suit their personal budgeting needs. The page will also provide users the function to filter their transaction history by various parameters and export the data into a CVS/PDF file for local record-keeping or sharing.

<span style="text-decoration:underline;">[Current Progress]</span>

The current application allows users to view their complete transaction history across all accounts. By clicking on an individual transaction, it will expand to show detailed information, where users can edit or create a category for that transaction. To support multi-entry comparisons, users can long click or press the Shift key to open multiple transaction entries simultaneously. Users can also switch between pages to navigate through all their transactions.

<span style="text-decoration:underline;">[Additional Features]</span>



1. Hide Internal Transfers
* Users will be able to hide transactions that are internal transfers between their own accounts, helping to reduce visual clutter and focus on meaningful spending patterns.
2. Custom Pagination Control
* Users can customize the number of transaction entries displayed per page for improved readability and control over their browsing experience.


### Analytics

<span style="text-decoration:underline;">[Proposed]</span>

In our proposed *Analytics *page, users will be able to select a custom date range to analyze their finances over a specific period. Based on the selected timeframe, the page will display:



1. Spending Trends
* A line chart that shows the user's spending patterns over time.
2. Spending by Category
* A pie chart with a legend showing category labels and the percentage of expenses attributed to each. 
3. Income vs Expenses
* A line chart tracking both income and expenses over time, alongside a bar chart that compares total income and total expenses during that period of time. In addition, the user's net savings will also be displayed.

This allows users to visualise when and where money is being spent, helping them better take control of their finances.

<span style="text-decoration:underline;">[Current Progress]</span>

The current implementation of the *Analytics* page allows users to select a date range for which they would like to analyze their finances for. Most charts have yet to be implemented. In place of the charts are placeholder icons to demonstrate the intended design of the page. A working bar chart has been implemented to compare total income and total expenses, with net savings displayed beneath it.

<span style="text-decoration:underline;">[Additional Features]</span>



1. Personalized Smart Financial Insights
* Our web will analyze users’ spending behaviour to provide actionable recommendations, such as identifying overspending specific categories or highlighting saving opportunities.


## Design Diagram


## 

![README](https://github.com/user-attachments/assets/f75f16ad-08ec-4d5f-998b-47dedb3edbe0)


## Timeline and Development Plan


<table>
  <tr>
   <td><strong>Task</strong>
   </td>
   <td><strong>Description</strong>
   </td>
   <td><strong>Date</strong>
   </td>
  </tr>
  <tr>
   <td>Preliminary research into suitable tech stack
   </td>
   <td>Familiarise with the features of React, Supabase and Vercel with the mission control workshops and own research.
   </td>
   <td>17 - 31 May
   </td>
  </tr>
  <tr>
   <td><em>Registration</em> page
   </td>
   <td>Working user authentication page using email and password
   </td>
   <td>25 - 26 May
   </td>
  </tr>
  <tr>
   <td>Basic core features
   </td>
   <td>Implement user interface of <em>Dashboard</em>,<em> Overview</em>, <em>Accounts</em>, <em>Transactions</em> and <em>Analytics</em> page
   </td>
   <td>26 - 31 May
   </td>
  </tr>
  <tr>
   <td>Data query
   </td>
   <td>Fetch sample data from Supabase to populate the UI for frontend testing
   </td>
   <td>30 May - 1 June
   </td>
  </tr>
  <tr>
   <td colspan="2" ><strong>Milestone 1</strong>
<ul>

<li>Ideation</li>

<li>Technical proof of concept</li> 
<ul>
 
<li>Implementation of <em>Registration</em> page</li>
 
<li>Implementation of basic core features of web application</li>
 
<li>Data query</li> 
</ul></li> 
</ul>
   </td>
   <td>2 June
   </td>
  </tr>
  <tr>
   <td>Improve <em>Registration</em> page
   </td>
   <td>Include the option of forgetting password and enable login and signup using Google and GitHub
   </td>
   <td>2 - 5 June
   </td>
  </tr>
  <tr>
   <td>Improve basic core features
   </td>
   <td>Improve user interface of <em>Dashboard</em>,<em> Overview</em>, <em>Accounts</em>, <em>Transactions</em> and <em>Analytics</em> page
   </td>
   <td>2 - 5 June
   </td>
  </tr>
  <tr>
   <td>Database security and authentication
   </td>
   <td>Implement row level security in the database
   </td>
   <td>2 - 5 June
   </td>
  </tr>
  <tr>
   <td>Uploading statement
   </td>
   <td>Enable uploading of statement to be processed using Python
   </td>
   <td>5 - 6 June
   </td>
  </tr>
  <tr>
   <td>Data preprocessing for database insertion
   </td>
   <td>Process data entry to ensure standardised headers and format consistency before writing into the database
   </td>
   <td>5 - 15 June
   </td>
  </tr>
  <tr>
   <td>Data filtering
   </td>
   <td>Implement filter logic for Transactions
   </td>
   <td>15 - 25 June
   </td>
  </tr>
  <tr>
   <td>Data analysis
   </td>
   <td>Implement analysis logic for Analytics
   </td>
   <td>15 - 25 June
   </td>
  </tr>
  <tr>
   <td>Exporting data
   </td>
   <td>Implement exporting of transaction data from multiple banks in a single file
   </td>
   <td>23 - 25 June
   </td>
  </tr>
  <tr>
   <td>Testing and debugging
   </td>
   <td>Preparation for Milestone 2
   </td>
   <td>25 - 29 June
   </td>
  </tr>
  <tr>
   <td colspan="2" ><strong>Milestone 2</strong>
<ul>

<li>Technical proof of concept</li> 
<ul>
 
<li>Implementation of backend logic</li>
 
<li>Working prototype of web application with improved features </li>
 
<li>System testing by developers and debugging</li> 
</ul></li> 
</ul>
   </td>
   <td>30 June
   </td>
  </tr>
  <tr>
   <td>Improve existing features
   </td>
   <td>Improve user experience by making web application more clean, intuitive and visually appealing
   </td>
   <td>30 June - 23 July
   </td>
  </tr>
  <tr>
   <td>Additional features
   </td>
   <td>Implement chosen additional features
   </td>
   <td>30 June - 23 July
   </td>
  </tr>
  <tr>
   <td>Testing and debugging
   </td>
   <td>Preparation for Milestone 2
   </td>
   <td>23 - 27 July
   </td>
  </tr>
  <tr>
   <td colspan="2" ><strong>Milestone 3</strong>
<ul>

<li>Technical proof of concept</li> 
<ul>
 
<li>Web application with improved and/or additional features</li>
 
<li>User testing and debugging</li> 
</ul></li> 
</ul>
   </td>
   <td>28 July
   </td>
  </tr>
  <tr>
   <td rowspan="2" >Refinement 
   </td>
   <td>Refine user interface and features
   </td>
   <td>28 July - 26 Aug
   </td>
  </tr>
  <tr>
   <td>Testing and debugging
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td colspan="2" ><strong>Splashdown</strong>
   </td>
   <td>27 August
   </td>
  </tr>
</table>



## Technical Proof of Concept

Refer to attached link:

[https://orbital-25-bank-sync.vercel.app/](https://orbital-25-bank-sync.vercel.app/)

*Remark: After logging in, refresh the page. Sample data will be displayed though no bank statements are uploaded, to support frontend testing and showcase the application's design and features.*


## Project Log

Refer to attached spreadsheet:

[https://docs.google.com/spreadsheets/d/1oHelazye9AUgeKT-OdoQFXvhSVOxhYITjRnC0GDVBe0/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1oHelazye9AUgeKT-OdoQFXvhSVOxhYITjRnC0GDVBe0/edit?usp=sharing) 
