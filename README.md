## Milestone 3 Submission


## Team name: 

BankSync


## Proposed Level of Achievement:

Project Apollo 11


## Aim

*BankSync* aims to be an all-in-one bank statement organiser that empowers users to take **better control of their finances** by **consolidating statements** from multiple institutions and **providing a clear overview of their spending and savings** to support informed financial decisions all through a **secure and user-friendly web application**.


## Motivation

Many individuals manage their finances across a wide range of financial institutions, including traditional banks, like OCBC, DBS/POSB, and UOB, as well as various credit cards, such as Revolut and YouTrip, and digital payment platforms, such as Google Pay, Apple Pay, GrabPay, and PayLah. This is usually because individuals want to leverage the unique services of each institution, helping them achieve greater convenience, reduce risk, or potentially increase returns.

With each account operating in its own ecosystem, users are often left juggling multiple apps, platforms, and statements to get a complete picture of their financial health. This fragmentation can make budgeting, expense tracking and savings management tedious and time-consuming. Although there are tools and apps that attempt to aggregate financial data, they are not always comprehensive, compatible with all institutions, or easy to use. As a result, many people still rely on manual tracking methods, such as spreadsheets or mental estimates, which can lead to inaccuracies and inefficiencies. The lack of real-time, consolidated visibility makes it easier to lose track of spending and overlook opportunities to save. In the long run, this can hinder effective financial planning and increase the risk of overspending or falling short on savings goals.


## Vision

We hope to provide users with an intuitive and user-friendly web application that consolidates and organizes monthly bank statements from multiple financial institutions, such as OCBC, DBS/POSB, UOB and SC. This will enable users to **track their spending, monitor account balances, and gain financial insights more effectively across multiple accounts**, ultimately helping them uncover opportunities to save. Our goal is to empower individuals with the tools they need to take control of their finances without the stress of logging into multiple apps or manually tracking expenses across different platforms.


## 


## User Story



1. As a bank account holder who wants to track my expenses across different banks, I want to be able to view all my monthly statements in one place.
2. As a user who wants to understand my financial behavior, I want to see visual charts of my spending and saving trends over time.
3. As a user who needs financial insights to more effectively manage my finances, I want to receive categorized spending reports and trend analyses.
4. As a taxpayer, I want to export income and expenses data by category and month for accounting purposes.
5. As a user who frequently downloads statements, I want to be able to export my data in multiple formats (PDF, CSV, etc.).
6. As a user switching banks for the best interest rates, I want to import past bank statements from older institutions so I don’t lose past financial data.


## Scope of Project

Our web application will allow users to **upload their monthly bank statements** from the major local banks including OCBC, DBS/POSB, UOB and SC. The platform will then present a **unified comprehensive view of their financial activity** by combining the bank statements. It will automatically **categorize expenses** and provide **visual dashboards** that break down spending habits over time, alongside comparisons to user’s income. Users will be able to monitor their account balances and track income and expenditure by category. In addition, users will be able to **export these data to PDF or Excel**, enabling users to maintain local financial records for accounting purposes, easy offline access or sharing. 


## 


## Features


### User Authentication

BankSync’s user authentication system is designed to provide secure and seamless access for users while protecting their sensitive financial data. Since users store private bank details on the platform, authentication is necessary to ensure that only authorized users can access their private information.

We support multiple authentication methods including:



* Login and signup using email and password with email confirmation
* Google OAuth 2.0
* GitHub OAuth 2.0

This system is built using Supabase’s PostgreSQL database, their built-in authentication and their instant APIs. We have also enforced a password requirement to ensure account security.

The key authentication features include: 



* Account creation
* Login and user authentication 
* Password reset functionality
* Account linking across different login methods
* Automatic redirection to user data if a valid session exists
* Redirection to *Login *page for unauthorized access attempts

Together, these features ensure both data security and a user-friendly experience, allowing users to authenticate smoothly while keeping their financial information protected.


### Dashboard

The dashboard supports tabbed navigation, allowing users to easily switch between different views of their financial data in our unified dashboard, eliminating the need to switch between multiple banking platforms. It has the following function tabs: *Overview*, *Accounts*, *Transactions* and *Analytics*, offering users a clear and comprehensive view of their financial data. Under the *Profile *menu, users are also able to sign out from the application, ensuring their data remains protected when the application is not in use. Users can also navigate to the *Settings* page from the *Profile *menu 


### 


### Statement Upload

Users are able to upload their monthly bank statements to the platform for automated parsing and analysis. The uploading of bank statement is currently limited to the following PDF bank statements:



* Oversea-Chinese Banking Corporation (OCBC)
* Development Bank of Singapore (DBS) / Post Office Savings Bank (POSB)
* United Overseas Bank (UOB)
* Standard Chartered (SC Bank)

After uploading their bank statements, users are able to preview the parsed data before it is stored. This review step allows them to verify the accuracy of the extracted information and make necessary amendments. This ensures transparency and gives users control over the information that will be saved. 


For unsupported banks, a generic parser has been implemented to extract its transaction data, but with limited functionality and certain restrictions. This includes:



* The transaction table must follow a specific header format to be parsed correctly: 

    ```
    Date | Description | Withdrawal/Deposit | Deposit/Withdrawal | Balance
    ```


* Account details such as account number and bank name cannot be detected and must be filled in manually.
* The parser is unable to detect the end of transactions on each page properly (as shown in the figure below), which may result in parsing inconsistencies.


These limitations can be addressed through further development, However, due to time constraints and the lower priority of this feature, this generic parser was not developed further.

After users review and confirm the parsed data, the verified data is encrypted with the AES-256 GCM (Advanced Encryption Standard with Galois/Counter Mode), providing strong protection for sensitive data such as private bank information. The encrypted data will then be uploaded to Supabase’s database, where it is accessible only to authenticated users, maintaining both privacy and data integrity. 



### Settings

The *Settings *page serves as a centralised interface for users to customise and manage their application preferences. Users will be able to configure account options such as category filters, username and other privacy settings such as password management, account connection and account deletion. It has the following tabs: *Username*, *Password*, *Filters*, *Connected Account* and *Account & Security, *providing an easy way to navigate between options. Users can also retract the side menu, providing a more compact view.


#### Update username

Users are able to change their username from the default, which is initially extracted from their email address. This allows for a more personalised and user-friendly experience across the platform.


#### 


#### Update Password

Users can update their password. Password requirement checking is also implemented here to ensure the new password is secure. Furthermore, this feature can be used to set email and password login if the user initially signs up with only Google or Github.


#### Customisable Category Condition

The automatic categorisation of each transaction during bank statement upload and parsing is based on keyword matching to predefined categories. This feature allows users to customize how their transactions are categorized. Users will be able to add or remove keywords, and order the priority of category detection. 


#### 


#### Connected Account

Users can link their account with different providers if not yet linked. The web app detects what email address the user is currently connected with and provides them a way to connect to another OAuth provider from Google or Github under the same email address. 


Although Supabase provides a method for manual linking, allowing users to connect to accounts registered with different email, this was not implemented due to time constraints. Implementing this would require significant changes to the existing logic, which currently assumes accounts share the same email address. Additionally, this feature is not considered a core priority.


#### Account and Security

Since our application contains sensitive user data, we have provided users the ability to either clear all transaction data or delete their account. There will also be an additional user check to ensure that this is not done on accident.


### Overview

On the *Overview *page, users can view their total balance, income and expenses, aggregated from all the monthly bank statements that they upload. Each tile can be clicked on to reveal a breakdown by individual account, giving users more detailed insights into their financial distribution. This design offers both a consolidated and account-specific view at a glance. Under the *Balance *tile, selecting a specific account will display a bar chart showing monthly inflows and outflows over recent months, providing users with a clear visual of their spending and saving patterns. Additionally, under the *Income *or *Expenses* tile, selecting a specific date will show a pie chart illustrating the distribution of income or expenses across different bank accounts for that month and year.


### Accounts

On the *Accounts* page, users can view detailed bank information organized by individual accounts. A summary of each account, including the account name, number, financial institution, and current balance is first presented in a compact format. Each account section can expand to reveal more structured details, along with an *All Transactions* button. Clicking this button displays a list of associated transactions, providing a clear and accessible overview. This creates a centralized platform where users can easily access and understand their financial data across multiple banks, eliminating the hassle of logging into multiple banking apps and manually piecing information together.


### 


### Transactions

The *Transactions* page displays a consolidated list of transaction history from multiple accounts, allowing users to view their financial activity in one place without needing to switch between multiple banking apps or downloaded bank statements. Each transaction is shown in a compact format, displaying the description, account name, category, deposit or withdrawal amount, and date. To support multi-entry comparisons, users can long click or press the Shift key to open multiple transaction entries simultaneously. Users can also switch between pages to navigate through all their transactions using the navigation button or arrow keys at the bottom of the page.


Each transaction can be clicked on to reveal more structured details, along with the options to update its category from an existing list or to create a new custom category. Users also have the ability to delete individual transactions if they do not want specific transactions to be recorded.


In addition, users can filter their transactions based on accounts, categories and date to view specific transaction types. This allows for more targeted analysis, helping users track spending and saving habits, monitor specific expenses, or review transactions related to particular goals or activities.


Moreover, users can export their account and transaction history to an Excel or PDF file, with the option of exporting just the previously filtered transactions. This allows for convenient personal record-keeping or offline analysis. For additional security, users will be able to encrypt the files using password protection.



The exported workbook in Excel will contain two sheets while the PDF will contain 2 tables, *Accounts* and *Transactions*. The *Accounts* sheet or table will show a view of all account balances, while the *Transactions* will show the consolidated transaction history of all accounts. 


### 


### Analytics

On the *Analytics *page, users can select a custom date range for which they would like to analyze their finances for. By default, the date range is set to the earliest and latest transaction date stored in the database. Based on the selected timeframe, the page will display:



1. Spending Trends
    * A line chart that shows the user's spending patterns over time.
2. Spending by Category
    * A pie chart with a legend showing category labels and the percentage of expenses attributed to each. 
3. Income vs Expenses
    * A line chart tracking both income and expenses over time, alongside a bar chart that compares total income and total expenses during that period of time. In addition, the user's net savings will also be displayed.

This allows users to visualise when and where money is being spent, helping them take better control of their finances.

If an invalid date range is chosen, an error message will appear. In which case, placeholder icons with descriptive text will be shown in place of the charts to demonstrate the intended design and functionality of the page.


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
   <td>Data querying
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
   <td>Data querying
   </td>
   <td>Fetch sample data based on specific conditions
   </td>
   <td>5 - 15 June
   </td>
  </tr>
  <tr>
   <td>Data filtering
   </td>
   <td>Implement filter logic for <em>Transactions</em>
   </td>
   <td>15 - 25 June
   </td>
  </tr>
  <tr>
   <td>Data analysis
   </td>
   <td>Implement analysis logic for <em>Analytics</em>
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
   <td>Database security and authentication
   </td>
   <td>Create Row-level Security (RLS) policies in the database
   </td>
   <td>25 - 27 June
   </td>
  </tr>
  <tr>
   <td>Data encryption
   </td>
   <td>Implement encryption and decryption logic  for uploading and retrieval of data
   </td>
   <td>25 - 28 June
   </td>
  </tr>
  <tr>
   <td>Testing and debugging
   </td>
   <td>Research on system and user testing
   </td>
   <td>26 - 29 June
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
   <td><em>Home</em> page
   </td>
   <td>Create a landing page
   </td>
   <td>30 June - 5 July
   </td>
  </tr>
  <tr>
   <td><em>Settings</em> page
   </td>
   <td>Create a page to allow users to change their username and password, delete their data or account, connect to their GitHub and Google account, and customise the auto-categorization of their transactions
   </td>
   <td>30 June - 5 July
   </td>
  </tr>
  <tr>
   <td>Database security and authentication
   </td>
   <td>Add a password requirement and enable Row-level Security (RLS) policies in the database
   </td>
   <td>30 June - 5 July
   </td>
  </tr>
  <tr>
   <td>Data querying
   </td>
   <td>Improve efficiency of data retrieval
   </td>
   <td>1 - 3 July
   </td>
  </tr>
  <tr>
   <td>Data filtering
   </td>
   <td>Extend filtering logic for Transactions
   </td>
   <td>3 - 5 July
   </td>
  </tr>
  <tr>
   <td>Data preprocessing for database insertion
   </td>
   <td>Implement duplicate checking and deletion, and create extension to support other banks
   </td>
   <td>5 - 7 July
   </td>
  </tr>
  <tr>
   <td>Uploading statement
   </td>
   <td>Include support for reading exported data and for generic files with specific table heading
   </td>
   <td>7 - 13 July
   </td>
  </tr>
  <tr>
   <td>Exporting data
   </td>
   <td>Extend to export filtered transactions and enable password encryption through backend (unable to be done on frontend)
   </td>
   <td>13 - 15 July
   </td>
  </tr>
  <tr>
   <td>Additional features
   </td>
   <td>Implement additional features
   </td>
   <td>15 - 27 July
   </td>
  </tr>
  <tr>
   <td>Improve existing features
   </td>
   <td>Improve user interface by making web application more clean, intuitive and visually appealing
   </td>
   <td>15 - 27 July
   </td>
  </tr>
  <tr>
   <td>Testing and debugging
   </td>
   <td>Implement system and user testing for frontend and backend
   </td>
   <td>30 June - 27 July
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
</table>



## 


## Software Engineering Practices


### Version Control

We use Git for version control to manage and track changes to our codebase. Git keeps a full history of all modifications made to the codebase, allowing us developers to revert to previous versions if something breaks or if a change does not work as expected. This makes it easy to experiment with new features without affecting the stable version of the code. Git also enables seamless collaboration by allowing multiple developers to work on different branches simultaneously and merge their work after their done. This avoids conflicts and makes it easy to identify who contributed what. 


#### Branching

Since we are working in pairs, it is important that we are able to contribute independently without interfering with each other’s work. To achieve this, we made full use of Git’s branching feature to prevent cross-contamination of codes and simplify the debugging process. The `main` branch always contains the most stable version of the code, serving as our production-ready codebase. When developing a new feature, we first pull the latest version from the `main` branch, and then create a separate branch named after the feature being developed. Once the feature is completed, the developer stages his code and commits the changes, then pushes the branch to GitHub for review. 


#### <span style="text-decoration:underline;">Pull Requests</span>

We use GitHub’s pull request feature to merge new features into the main branch. After one of us completes a feature, they will open a pull request, which is reviewed by the other person. This promotes accountability and encourages communication within the team. Reviewing pull requests also helps to catch potential bugs early and prevents incorrect resolution of merge conflicts. A pull request is only merged after it is reviewed, approved and all conflicts are resolved.


### Code Linting

We used ESLint to enforce consistent coding standards across the codebase. It helps to detect syntax errors, potential bugs, and stylistic issues during development, promoting cleaner and more maintainable code. By catching these issues  early, we are able to reduce the likelihood of runtime errors and improve overall code quality before changes are deployed to production. 


### 


### Single Responsibility Principle & Separation of Concerns Principle

We ensured that each page, component and custom hook in our application has a clear and well-defined responsibility. Each unit is designed to handle a single concern. For example:



* `TransactionRow` is solely responsible for rendering information of a single transaction row.
* `Analytics` handles the validation of the selected date range and controls the overall layout of the *Analytics *page, while components such as `AnalyticsIncomeVsExpenses`, `AnalyticsSpendingCategory` and `AnalyticsSpendingTrend` are each dedicated to rendering a specific chart in the *Analytics *page.
* Functions are broken down into smaller, pure functions such as `uploadFile`, `decryptData` and `encryptData`, each responsible for a distinct task.

These are done in order to improve readability, maintainability and testability, ensuring our codebase remains modular, easier to debug, and simpler to test. This separation of concerns also makes it easier to add new features or remove existing ones without introducing unintended side effects, thereby improving the overall flexibility and scalability of the application.


### Don’t Repeat Yourself (DRY) Principle

We applied the DRY principle throughout our project to minimize code duplication and simplify maintainability. For example, 



1. Reusable Query and Decryption Functions
    * Instead of writing a separate query and corresponding decryption logic for every data need, we designed a single, reusable function per table in the database for both querying and decryption. Query functions accept dynamic parameters for column selection, filtering and sorting, allowing us to fetch different subsets of the data using one centralized logic, making them flexible for data request. Meanwhile, the decryption functions focus solely on processing encrypted results, maintaining clear separation of concerns.
2. Shared Utilities
    * Common tasks are encapsulated in reusable functions in the `utils` directory, so that the same logic never has to be rewritten.
3. Centralized Constants and Configurations
    * We centralized constants and configurations to reduce redundancy and maintain consistency across the codebase. For example, type definitions are defined in `types.ts`, providing a single source of truth for commonly used interfaces, whereas Supabase calls and their related decryption routines are consolidated in the `supabase_query.ts`.

These help to eliminate code redundancy, ensure consistency, and make future updates straightforward.


### 


### Interface Segregation Principle

We abided by the Interface Segregation Principle by designing small, focused types, interfaces and function parameters that expose only the necessary data and behaviour for each use case. Function parameters were tailored specifically to what each function needs to operate, and the corresponding types and interfaces were structured to ensure only relevant query fields are passed in without forcing unused or unrelated data. This approach reduces coupling, improves code maintainability, and enhances flexibility by allowing different parts of the codebase to operate independently without being tied to unnecessary logic or data.


### Environment Configuration

Sensitive information such as API keys and encryptions keys are stored securely in `.env` files. These files are excluded from version control using `.gitignore`, ensuring that secrets are not accidentally pushed to the remote repository. This setup protects sensitive data and allows for safer collaboration across different development environments.


## Quality Control


### Automated Testing

Automated tests are essential for verifying features and catching bugs to ensure our web application will perform as expected. For *BankSync*, we plan to implement the following types of system testing for both frontend and backend:



1. Unit testing
    * Tests a specific function or component of our program and mocks all its dependencies to detect bugs early and verify that they behave correctly in isolation.
2. Integration testing
    * Combines different modules or components and tests them as a group to verify their interactions and data flow.
3. Github actions
    * Integrate our testing process into our development workflow by automatically running tests when new code is pushed or pull request is created, helping to maintain a reliable codebase and prevent broken code from being merged.


#### 


#### Frontend

Unit and integration testing were carried out using `Jest` and `React Testing Library`, which support live testing during development. We mainly focused on the test cases for our charts and tables. One major challenge we faced was testing charts rendered by `react-chartjs-2`, which uses the `&lt;canvas>` element that Jest does not support. However, since the internal rendering of charts is handled by `Chart.js` and thoroughly tested in its own library, we chose to mock the chart components and focus on testing the props passed to them instead.


For unit testing, we wrote test cases to validate component behaviour and user interactions. For instance, in the testing of the *Spending Category Pie Chart* under the *Analytics *tab, we mocked all its dependencies, including the `useDatabase` context and the `getTransactionDetails` function, and tested how the component responds when given both valid and invalid date ranges. These tests help maintain UI stability as the application grows.

For integration testing, we focused on verifying that multiple components worked together as expected. Continuing with the earlier example on *Spending Category Pie Chart*, this time we only mocked the database and tested how changes in the date picker correctly triggered data retrieval and passed the expected values into the chart component.


#### Backend

Unit and integration testing were carried out using `Pytest`, which allows the generation of an interactive HTML report. We decided against using mock PDFs and instead skipped testing the PDF conversion process. Instead, we recreated the test files in plain text. This was because reproducing the original format of bank statements in PDF is challenging, as the PDFs need to be generated using an external library, which we had limited control over. Additionally, the file conversion process has less impact on the core functionality compared to the actual parsing and formatting of the transaction data.


For unit testing, a comprehensive list of test cases was written to validate the core logic for breaking down transaction rows. The test cases cover multiple edge cases to ensure consistent behaviour. This was especially important since our web application needs to be able to process bank statements from different banks, each with its own unique formats, such as different delimiters, date formats and spacings. We also tested the FastAPI endpoints to ensure that the API behaves correctly from the user’s perspective.


Our integration test covered the end-to-end process from receiving the bank statement to returning the parsed results. These were tested together to ensure individual components of the parsing system work together as intended. The test cases were designed based on expected file layouts and included edge cases, such as empty pages.


#### Github Actions

Github Actions was integrated into the CI/CD pipeline to automate testing for both frontend and backend using `Pytest` and `Jest`, respectively. A custom workflow was created to ensure all code pushed to branches or submitted via pull requests is automatically tested. This helps maintain code quality, detect issues early and enforce consistency across the database. 


### 


### User Testing

To gather user feedback on our web application, we created a Google Form and shared it with our family, relatives and friends. The questions covered various aspects, from functionality, overall user experience, usefulness and more. The feedback helped us identify weaknesses that we, as developers, did not notice, and suggested new features that we did not previously consider. 

<span style="text-decoration:underline;">Questions </span>


<table>
  <tr>
   <td><strong>Questions</strong>
   </td>
   <td><strong>Purpose</strong>
   </td>
  </tr>
  <tr>
   <td>How easy was it to use the platform?
   </td>
   <td>To evaluate usability and user-friendliness
   </td>
  </tr>
  <tr>
   <td>How accurate was the reading of your bank statement?
   </td>
   <td>To assess the core functionality and accuracy of the statement parsing feature
   </td>
  </tr>
  <tr>
   <td>How helpful was the platform in helping you organise and better understand your finances?
   </td>
   <td>To measure the value and usefulness of the platform in terms of financial awareness, organization, and insights
   </td>
  </tr>
  <tr>
   <td>How useful do you find the ability to export your financial data?
   </td>
   <td>To evaluate how much users value data portability
   </td>
  </tr>
  <tr>
   <td>Did you encounter any issues while using BankSync? If yes, please elaborate on them.
   </td>
   <td>To uncover bugs, glitches or friction points that users faced, helping in debugging and improving user experience
   </td>
  </tr>
  <tr>
   <td>What do you like and dislike about BankSync?
   </td>
   <td>To get qualitative feedback on what is working well and what is not from a user perspective so that we are able to prioritize strengths and address weaknesses
   </td>
  </tr>
  <tr>
   <td>Do you have any suggestions to improve the usability or effectiveness of BankSync?
   </td>
   <td>To invite constructive ideas for improvement
   </td>
  </tr>
  <tr>
   <td>If this tool was published, would you use it? Why, or why not?
   </td>
   <td>To gauge potential adoption and real-world value
   </td>
  </tr>
</table>


Refer to attached for published Google Form: [https://forms.gle/sgycwHDFW7qcjmbdA](https://forms.gle/sgycwHDFW7qcjmbdA)

Refer to attached for the Google Form responses:

[https://docs.google.com/spreadsheets/d/1N526Kch8VjPz0vs369cNnoiNP920zZZJmZjFIfXyvZk/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1N526Kch8VjPz0vs369cNnoiNP920zZZJmZjFIfXyvZk/edit?usp=sharing) 



<span style="text-decoration:underline;">Considered Feedback</span>

Most of the feedback highlighted that the interface was easy to navigate and user-friendly. Users also appreciated the ability to view all their accounts and transactions in one place as they found it useful for managing their finances. However, some noted that the web application felt slow. Unfortunately, this is a known limitation due to our backend being hosted on Render which has performance constraints such as limited speed and low RAM. Nonetheless, there was some feedback that we took into consideration.


<table>
  <tr>
   <td><strong>Feedback</strong>
   </td>
   <td><strong>Remediation Plans</strong>
   </td>
  </tr>
  <tr>
   <td>“It would be nice if there were more features to personalise user accounts.”
   </td>
   <td>We introduced options to customize the user profiles, such as updating their username and password, and configuring how their transactions are categorized.
   </td>
  </tr>
  <tr>
   <td>“Displaying only total income and expenses becomes less meaningful over time.”
   </td>
   <td>Along with displaying total income and expenses, the income and expenses of the previous month will also be shown.
   </td>
  </tr>
</table>



## Limitations


### Render Hosting and Parsing 

Hosting the backend on Render’s free plan introduces several performance constraints, including limited CPU, slow speed and low RAM, resulting in a sleep timeout after 15 minutes of inactivity. This leads to cold starts that can take up to a minute, significantly slowing down the user experience. As we need to be able to upload and retrieve data conveniently and easily since it is part of a feature of our web application, we had to make use of another service, UpTimeRobot, to ping the backend through a custom API endpoint every 10 minutes to keep the backend awake, avoiding the 1 minute of cold start. However, this approach is not foolproof and does not completely prevent the cold start issue. Every few days Render will wind down the process despite the regular pinging. 

Furthermore, the low resource allocation of shared core use of 0.1 CPU of free tier causes the speed of uploading and parsing of data to be particularly slow when multiple people are uploading files at the same time, especially for statements from OCBC which requires up to 20 seconds on Render to extract the text due to the PDF’s complex hidden layout. 

Additionally, due to limited processing power and memory, we are not able to use resource-intensive parsing methods such as Optical Character Recognition (OCR) to parse copy-protected files or use Natural Language Processing (NLP) models for tabular data. As a result, our parsing logic is currently hardcoded with limited flexibility, making it harder to adapt to changes in statement formats from banks in the future.


### 


### Supabase Authentication Hosting

Supabase’s free plan uses a fixed default authentication domain, which results in a generic and unfamiliar-looking URL. This can raise concerns among users as it may resemble a phishing or scam link, potentially undermining trust during the signup process. 


### Long-term Performance

As the volume of users and data in the dataset grows, key operations such as querying and data parsing will begin to strain the limits imposed by the free plan of the services currently in use. Issues we expect to encounter in the long run include query timeouts due to long processing time from Render’s low CPU power, database size and query rate limitations imposed by Supabase, and the unreliability of using UptimeRobot to prevent Render from idling. These constraints may significantly impact the responsiveness and scalability of our web application. 


### Data Retrieval

A key limitation is the lack of publicly available APIs provided by banks, which restricts the ability to directly and securely retrieve transaction data directly from the bank. This results in the need of manually uploading the monthly bank statements, introducing possible inconsistencies as formatting gets updated over the years. Furthermore, as most banks no longer provide monthly statements through email due to security issues, we are unable to automate the process of uploading the statement, adding on an additional work of navigating through all the banking apps, downloading the statements, before being able to upload to *BankSync *every month.


## 


## Challenges Faced


### Encryption Challenges

Initial attempts at implementing data encryption using the `crypt-vault` library presented several challenges, specifically the lack of proper documentation and use of outdated dependencies. This introduced unexpected bugs due to inconsistency during decryption using the same key. Despite multiple attempts to resolve the bug, decryption would only succeed intermittently, making the library unreliable. Hence, we had to migrate the entire encryption and decryption logic to Node.js’s native `crypto` module, which caused significant delays in development.


### Lack of Testing Resources

One of the biggest obstacles faced in developing the parsing of monthly bank statement files was the lack of diverse testing samples. We did not have enough variations of bank statements to test all possible edge cases across different scenarios, such as multiple bank accounts within a single statement or accounts using multiple currencies. Even among the more abundant DBS samples, many new and unexpected formatting edge cases frequently emerged, such as negative signs appearing at the end of numbers or unexplained rows missing key details. To workaround this, we created sample files using extracted text from PDFs and built test cases based on assumptions and outdated screenshots of statements found online in an attempt to replicate real-world layouts. Though these synthetic test cases helped us uncover and fix some bugs, they were limited in their ability to capture the full breadth of real-world variability. This made it difficult to develop a robust and comprehensive parsing logic, which in turn impacted the overall accuracy and reliability of the parser, and thus our web application itself.


### Vercel Collaborator Limit

Vercel’s free plan limits the number of collaborators to zero, meaning only one team member can access the Vercel dashboard and manage deployments. This reduces the team’s efficiency as only that member is able to test GitHub branches live on Vercel. Additionally, since other members cannot complete pull requests independently, the responsibility of merging and previewing deployment falls entirely on the single team member with access.


## 


## Tech Stack


### Frontend

<span style="text-decoration:underline;">React</span>

* We use React to create UI components and manage how those components interact with each other, making it easier to build web applications.

<span style="text-decoration:underline;">Chart-js</span>

* Chart-js is used to create the interactive and visually appealing charts in our web application that serve to help users gain financial insights.

<span style="text-decoration:underline;">Tailwind CSS</span>

* Tailwind CSS is used to design consistent and responsive layout efficiently by applying utility classes directly in our components.

<span style="text-decoration:underline;">Material UI (MUI)</span>

* MUI provides a set of pre-built customizable components, which we use to help us build a more clean and visually-appealing user interface.

<span style="text-decoration:underline;">Vercel</span>

* We deployed the frontend of our web application on Vercel as it is a fast and reliable hosting platform that allows continuous deployment.


### Backend

<span style="text-decoration:underline;">FastAPI</span>

* We use FastAPI to build the backend API as it enables efficient request and response handling and clear documentation of endpoints and data models.

<span style="text-decoration:underline;">Python</span>
* We use Python to parse the uploaded bank statements, extract structured data, and prepare it for storage and analysis.

<span style="text-decoration:underline;">Render</span>

* Render is used to deploy and host the backend of our web application, providing scalable and reliable infrastructure for API delivery.

<span style="text-decoration:underline;">Supabase</span>

* Supabase is used for user authentication and serves as our database to store encrypted financial data securely.


### Testing

<span style="text-decoration:underline;">Pytest</span>

* We use Pytest for unit testing our backend code to ensure functions behave as expected through assertions and clear output, helping maintain consistent and reliable logic. 

<span style="text-decoration:underline;">Jest</span>

* Jest is used for running our tests on the frontend logic, components and hooks to ensure they function correctly during feature development and complex data handling.

<span style="text-decoration:underline;">React Testing Library</span>

* React testing library is used together with Jest to simulate user interaction to check how the app behaves and displays data.


## Technical Proof of Concept

Refer to attached link:

[https://orbital-25-bank-sync.vercel.app/](https://orbital-25-bank-sync.vercel.app/)


## Project Log

Refer to attached spreadsheet:

[https://docs.google.com/spreadsheets/d/1oHelazye9AUgeKT-OdoQFXvhSVOxhYITjRnC0GDVBe0/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1oHelazye9AUgeKT-OdoQFXvhSVOxhYITjRnC0GDVBe0/edit?usp=sharing) 
