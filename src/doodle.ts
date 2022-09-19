import { ipfs, json } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/Doodle/Doodle"
import {
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  const metadataHash = "QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS"
  const metadata = ipfs.cat(`${metadataHash}/${event.params.tokenId}`)
  if(metadata) {
    const metadataJson = json.fromBytes(metadata).toObject()

    const image = metadataJson.get("image")
    if(image) {
      entity.image = image.toString()
    }

    const description = metadataJson.get("description")
    if(description) {
      entity.description = description.toString()
    }

    const attributes = metadataJson.get("attributes")
    if(attributes) {
      const attributesArray = attributes.toArray()
      for(let i = 0; i < attributesArray.length; i++) {
        const item = attributesArray[i].toObject()
        const traitType = item.get("trait_type")
        const value = item.get("value")
        if(traitType && value) {
          if(traitType.toString() === "face") {
            entity.face = value.toString()
          } else if(traitType.toString() === "hair") {
            entity.hair = value.toString()
          } else if(traitType.toString() === "body") {
            entity.body = value.toString()
          } else if(traitType.toString() === "background") {
            entity.background = value.toString()
          } else if(traitType.toString() === "head") {
            entity.head = value.toString()
          } else {
            //nop
          }
        }
      }
    }
  }
  entity.save()
}
