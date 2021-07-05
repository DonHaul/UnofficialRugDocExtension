#!/usr/bin/env python
# coding: utf-8

# In[2]:
import os

from selenium import webdriver
from selenium.webdriver.common.keys import Keys


# In[3]:


options = webdriver.ChromeOptions()
import os

options = webdriver.ChromeOptions()
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument('--disable-gpu')
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=options)

driver.get("https://rugdoc.io/")

##initial extractor


# In[4]:


# Module Imports
import mariadb
import sys
import time
import credentials

# Connect to MariaDB Platform
try:
    con = mariadb.connect(
        user=credentials.user,
        password=credentials.password,
        host=credentials.host,
        port=credentials.port,
        database=credentials.database

    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

# Get Cursor
c = con.cursor()


# In[7]:


time.sleep(5)
#time.sleep(3600)


#fetch all farms
els = driver.find_elements_by_css_selector('.tab')

el_id=0

#go 1 by 1 from the start untill one is indeed in db
#populate db
for el in els:

    #extract info
    html = el.get_attribute('outerHTML')
    text = el.find_element_by_css_selector('.tab-project-title ').text
    risk = el.find_element_by_css_selector('.rugdoc-rating span').text.lower()
    try:
        child_text = el.find_element_by_css_selector('.tab-project-title span').text
        text = text.replace(child_text, '')
    except:
        print("err")

    text = text.strip().lower()

    #print(text,html)


    item = (text,html,risk)

    c.execute('select count(*) from farms where name=?', (text,))

    rows = c.fetchone()[0]
    print(text)
    if rows == 1 :
        print("el found in db, continuing",text)
        continue

    #c.execute('insert into farms values (?,?)', item)
    c.execute('insert into farms (name,html,risk)values (?,?,?)', item)



    print(text)
    con.commit()


# In[8]:


c.close()
con.close()

print("Finished Successfully")