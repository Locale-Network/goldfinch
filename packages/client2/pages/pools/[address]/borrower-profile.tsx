import { gql } from "@apollo/client";
import Image from "next/image";

import { ChipLink, Link } from "@/components/design-system";
import { renderRichText } from "@/components/rich-text";
import {
  BorrowerProfileFieldsFragment,
  BorrowerOtherPoolFieldsFragment,
} from "@/lib/graphql/generated";

import { BorrowerTeam } from "./borrower-team";
import {
  BorrowerFinancialsTable,
  UnderwritingPerformanceTable,
} from "./deal-tables";
import { DocumentsList } from "./documents-list";

export const BORROWER_OTHER_POOL_FIELDS = gql`
  fragment BorrowerOtherPoolFields on TranchedPool {
    id
    name @client
  }
`;

export const BORROWER_PROFILE_FIELDS = gql`
  fragment BorrowerProfileFields on Borrower {
    id
    name
    logo {
      url
    }
    bio
    website
    twitter
    linkedin
    underwritingPerformance {
      ...BorrowerPerformanceTableFields
    }
    borrowerFinancials {
      ...BorrowerFinancialsTableFields
    }
    team {
      description
      members {
        ...CMSTeamMemberFields
      }
    }
    mediaLinks {
      url
      title
    }
    contactInfo {
      email
      description
    }
    documents {
      ...DocumentFields
    }
    deals {
      id
      name
    }
  }
`;

interface BorrowerProfileProps {
  borrower: BorrowerProfileFieldsFragment;
  borrowerPools: BorrowerOtherPoolFieldsFragment[];
}

export function BorrowerProfile({
  borrower,
  borrowerPools,
}: BorrowerProfileProps) {
  return (
    <div className="space-y-20">
      <div>
        <div className="mb-8 items-center justify-between lg:flex">
          <div className="mb-3 flex items-center">
            {borrower.logo && (
              <div className="relative mr-3 h-8 w-8 overflow-hidden rounded-full border border-sand-200">
                <Image
                  src={borrower.logo.url as string}
                  alt={borrower.name}
                  className="block h-full w-full object-contain object-center"
                  layout="fill"
                  sizes="32px"
                />
              </div>
            )}

            <h2 className="text-3xl lg:mb-0">{borrower.name}</h2>
          </div>
          <div className="flex gap-2">
            {borrower.website ? (
              <ChipLink
                iconLeft="Link"
                href={borrower.website}
                target="_blank"
                rel="noreferrer"
              >
                Website
              </ChipLink>
            ) : null}
            {borrower.linkedin ? (
              <ChipLink
                iconLeft="LinkedIn"
                href={borrower.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </ChipLink>
            ) : null}
            {borrower.twitter ? (
              <ChipLink
                iconLeft="Twitter"
                href={borrower.twitter}
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </ChipLink>
            ) : null}
          </div>
        </div>

        {borrower.bio ? (
          <div className="mb-8">{renderRichText(borrower.bio)}</div>
        ) : null}
      </div>

      <BorrowerFinancialsTable
        otherPools={borrowerPools}
        borrowerFinancials={borrower.borrowerFinancials}
      />

      <UnderwritingPerformanceTable
        details={borrower.underwritingPerformance}
      />

      {borrower.team &&
      ((borrower.team.members && borrower.team.members.length > 0) ||
        borrower.team?.description) ? (
        <BorrowerTeam
          members={borrower.team.members}
          description={borrower.team.description}
        />
      ) : null}

      {borrower.mediaLinks && borrower.mediaLinks.length > 0 ? (
        <div>
          <h3 className="mb-8 text-lg font-semibold">Media</h3>
          <ul>
            {borrower.mediaLinks.map((link, idx) => (
              <li
                key={`borrower-media-link-${link.url}-${idx}`}
                className="py-1"
              >
                <Link
                  href={link.url as string}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-eggplant-700 underline sm:gap-2"
                  iconRight="ArrowTopRight"
                >
                  {link.title as string}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {borrower.contactInfo?.description || borrower.contactInfo?.email ? (
        <div>
          <h3 className="mb-8 text-lg font-semibold">Contact Information</h3>
          {borrower.contactInfo.description ? (
            <p>{borrower.contactInfo.description}</p>
          ) : null}
          {borrower.contactInfo.email ? (
            <a
              href={`mailto:${borrower.contactInfo.email}`}
              className="text-eggplant-700 underline"
            >
              {borrower.contactInfo.email}
            </a>
          ) : null}
        </div>
      ) : null}

      {borrower.documents && borrower.documents.length > 0 ? (
        <DocumentsList documents={borrower.documents} />
      ) : null}
    </div>
  );
}
