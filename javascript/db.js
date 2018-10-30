var db = (function() {
    const Authorization = 'Basic ' + btoa("fc7939e1c9a4c40ea4a9faa296186b64160992ef:x")
    const headers = {
        Authorization,
        // Accept: 'application/json,application/xml,application/x-www-form-urlencoded,text/html',
        // 'Access-Control-Allow-Origin': '*'
        // 'Content-Type': 'text/plain',
    };
    const opts = {
        // type: 'GET',
        headers,
    };

    let products = []
    let customers = []
    let fetchData = async () => {
        const baseURL = "http://electricaltape.c2.imonggo.com/api"
        const productsResp = await fetch(baseURL + '/products', opts);
    
        console.log(productsResp);

        products = await productsResp.json();

        const custResp = await fetch(baseURL +'/customers', opts);

        customers = await custResp.json()
    }
    
    const tax_rates = [
        { name: 'VAT',
          rate: '12%',
          tax_rate_type: 0,
        },
        { name: 'Austin',
          rate: '5%',
          tax_rate_type: 1,
        },
        { name: 'Excise',
          rate: '10%',
          tax_rate_type: 1,
        },
        { name: 'Sin',
          rate: '2%',
          tax_rate_type: 1,
        },
    ]

    const settings = {
        enableTax: { 
          code: 'enableTax',
          name: 'Enable compute tax',
          value: true
        },
        singleTax: { 
          code:  'singleTax',
          name: 'Single Tax',
          value: true
        },
        taxInclusive: {
          code: 'taxInclusive',
          name: 'Tax Inclusive',
          value: true
        }
    }

    const openInvoice = {
        invoiceLines: {},
        customer: null,
        amount: 0,
        tax: 0,
    }

    return {
        products: products,
        customers: customers,
        tax_rates: tax_rates,
        settings: settings,
        openInvoice: openInvoice,
        fetchData
    }
})()