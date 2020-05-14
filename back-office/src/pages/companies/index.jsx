import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import { useQuery, useMutation } from "@apollo/react-hooks"
import { GET_COMPANIES } from "../../graphql/company"
import { DELETE_COMPANY, CREATE_COMPANIES } from "../../graphql/company"

import withAuthenticationCheck from "../../components/hocs/withAuthenticationCheck"
import Index from "../../components/Index"
import Loader from "../../components/Loader"

import { companyTypeNames } from "../../utils/wording"


const CompaniesIndex = ({ history }) => {

  const { error, data: { getCompanies: companies } = {}, loading, refetch } = useQuery(GET_COMPANIES, {
    onError: error => console.log(error.message),
  })

  const [ importCompanies ] = useMutation(CREATE_COMPANIES, {
    update (cache, { data: { createCompanies } }) {
      const { getCompanies } = cache.readQuery({ query: GET_COMPANIES })
      cache.writeQuery({
        query: GET_COMPANIES,
        data: { getCompanies: [ ...createCompanies, ...getCompanies ] },
      })
    },
  })

  const [deleteCompany] = useMutation(DELETE_COMPANY, { onCompleted: refetch })

  const columns = useMemo(() => [
    {
      Header: "Nom",
      accessor: "name",
      Cell ({ cell: { value }, row: { original: { id } } }) {
        return (
          <Link to={`/company/${id}`} className="has-text-primary underline">
            {value}
          </Link>
        )
      },
    },
    {
      Header: "Type",
      accessor: ({ type }) => companyTypeNames[type],
    },
    {
      Header: "Utilisateurs",
      accessor: "userCount",
      Cell ({ cell: { value }, row: { original: { id } } }) {
        return (
          <div className="flex">
            <span className="icon"><i className="ri-group-line"/></span>
            <span>{value}</span>
          </div>
        )
      },
    },
    {
      Header: "Adresse",
      accessor: ({ address: { street, zipCode, city } }) => `${street}, ${zipCode} ${city}`,
      Cell ({ cell: { value }, row: { original: { id } } }) {
        return (
          <div className="flex">
            <span className="icon has-text-grey"><i className="ri-map-pin-2-line"/></span>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(value)}`} className="has-text-grey underline" target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          </div>
        )
      },
    },
    {
      Header: "Facturation",
      accessor: ({ stripeInvoices: [ last ] }) => last && new Date(last.created*1000).toLocaleDateString(),
    },
    // {
    //   id: "edit",
    //   Cell ({ cell: { value }, row: { original: { id } } }) {
    //     return (
    //       <Link to={`/company/${id}/update`} className="button has-text-grey is-small">
    //         Modifier
    //       </Link>
    //     )
    //   },
    // },
    {
      id: "delete",
      Cell ({ cell: { value }, row: { original: { id } } }) {
        return (
          <button onClick={() => deleteCompany({ variables: { id } })} className="button is-white has-text-grey">
            <span className="icon"><i className="ri-delete-bin-line"/></span>
          </button>
        )
      },
    },
  ], [])


  if (error) return <div>{error.message}</div>

  if (loading) {
    return (
      <Loader />
    )
  }


  const tabs = [
    { title: "Aucun", filter: () => true },
    ...Object.entries(companyTypeNames).map(companyType => ({
      title: companyType[1], filter: ({ type }) => type === companyType[0],
    })),
  ]


  return (
    <Index data={companies} columns={columns} tabs={tabs}>
      {{
        slug: "company",
        entity: "entreprise",
        onImport: ({ data: companies }) => importCompanies({ variables: {
          companies: companies.map(({ isRepresentative, ...rest }) => ({ isRepresentative: Boolean(isRepresentative), ...rest })),
        } }),
        onExport: ({ name: companyName, type: companyType, address: { street: streetCompany, zipCode: zipCodeCompany, city: cityCompany }, representativeUser: { firstName: firstNameUser, lastName: lastNameUser, email: emailUser, phone: phoneUser, role: roleUser, isRepresentative }, emailDomains }) => ({ companyName, companyType, streetCompany, zipCodeCompany, cityCompany, firstNameUser, lastNameUser, emailUser, phoneUser, emailDomains, roleUser, isRepresentative }),
      }}
    </Index>
  )
}

CompaniesIndex.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default withAuthenticationCheck(CompaniesIndex, ["SUPER_ADMIN"])
